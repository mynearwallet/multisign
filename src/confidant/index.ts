import * as NearApiJs from 'near-api-js';
import { KeyPairEd25519 } from 'near-api-js/lib/utils/key_pair';
import { SignedTransaction } from 'near-api-js/lib/transaction';
// @ts-ignore
import { parseSeedPhrase } from 'near-seed-phrase';
import sha256 from 'js-sha256';
import nacl from 'tweetnacl';
import Near from '../near';
import ConfidantService, { AuthData } from '../api/confidant-service';
import getNetworkConfig from '../lib/network';
import { multiSignStep1, multiSignStep3 } from '../../client';
import createKeyPairEd25519 from '../lib/crypto';

export default class Confidant {
  public static keyPairBySeedPhrase(phrase: string): KeyPairEd25519 {
    return createKeyPairEd25519.fromString(parseSeedPhrase(phrase).secretKey);
  }

  public static createRandomKeyPair(): KeyPairEd25519 {
    return NearApiJs.utils.KeyPairEd25519.fromRandom();
  }

  public static async saveKeyPairLocally(accountId: string, keyPair: KeyPairEd25519) {
    const keyStore = new NearApiJs.keyStores.BrowserLocalStorageKeyStore();
    await keyStore.setKey(getNetworkConfig().networkId, accountId, keyPair);
  }

  public static async getKeyPair(accountId: string): Promise<KeyPairEd25519|null> {
    const keyStore = new NearApiJs.keyStores.BrowserLocalStorageKeyStore();
    const key = await keyStore.getKey(getNetworkConfig().networkId, accountId);

    /* eslint-disable max-len */
    /**
     * No generic type
     * @link {https://github.com/near/near-api-js/blob/master/src/key_stores/browser_local_storage_key_store.ts#L60}
     */
    /* eslint-enable max-len */
    return key as KeyPairEd25519;
  }

  public static async handshake(
    accountId: string,
    secret: string,
  ): Promise<void> {
    const newKeyPair = Confidant.createRandomKeyPair();
    await Confidant.saveKeyPairLocally(accountId, newKeyPair);
    const handshakeResponse = await ConfidantService.handshake(
      newKeyPair.getPublicKey().toString(),
      sha256.sha256.hex(secret),
    );

    const combinedKey = NearApiJs.utils.PublicKey
      .fromString(handshakeResponse.combinedKey);
    const secretKeyPair = createKeyPairEd25519.fromString(secret);
    await Near.addPublicKey(accountId, secretKeyPair, combinedKey);
  }

  public static async getCombinedKey(accountId: string) {
    const keyPair = await Confidant.getKeyPair(accountId);

    if (!keyPair) {
      throw Error('Cannot create keypair with nullable accountId');
    }

    const response = await ConfidantService.getCombinedKey(
      keyPair.getPublicKey().toString()
    );

    return NearApiJs.utils.PublicKey.fromString(response.combinedKey);
  }

  public static async multisigSign(
    transaction: NearApiJs.transactions.Transaction,
    privateKey: NearApiJs.utils.KeyPairEd25519,
    combinedPublicKey: NearApiJs.utils.PublicKey,
    auth?: AuthData,
  ): Promise<SignedTransaction|null> {
    const step1 = multiSignStep1();
    const encodedTransaction = transaction.encode();

    const serializedTxHash = new Uint8Array(
      sha256.sha256.array(encodedTransaction)
    );

    const step2Data = await ConfidantService.signTransaction(
      NearApiJs.utils.serialize.base_encode(serializedTxHash),
      NearApiJs.utils.serialize.base_encode(step1.data),
      privateKey.getPublicKey().toString(),
      auth
    );

    if (!step2Data.success) {
      alert(step2Data.reason);
      console.error(step2Data.reason);

      return null;
    }

    if (!step2Data.data) {
      alert('Multisig failed');
      console.error('Multisig failed');

      return null;
    }

    const signature = multiSignStep3(
      NearApiJs.utils.serialize.base_decode(step2Data.data),
      step1.secret,
      serializedTxHash,
      combinedPublicKey.data,
      NearApiJs.utils.serialize.base_decode(privateKey.secretKey)
    );

    if (signature === null) {
      return null;
    }

    const nacltest = nacl.sign.detached.verify(
      serializedTxHash,
      signature,
      combinedPublicKey.data,
    );

    console.log('NaclTest', nacltest);

    const signedTransaction = new NearApiJs.transactions.SignedTransaction({
      transaction,
      signature: new NearApiJs.transactions.Signature({
        keyType: transaction.publicKey.keyType,
        data: signature,
      }),
    });

    return signedTransaction;
  }
}
