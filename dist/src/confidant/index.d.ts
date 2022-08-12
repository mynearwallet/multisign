import * as NearApiJs from 'near-api-js';
import { KeyPairEd25519 } from 'near-api-js/lib/utils/key_pair';
import { SignedTransaction } from 'near-api-js/lib/transaction';
import { AuthData } from '../api/confidant-service';
export default class Confidant {
    static keyPairBySeedPhrase(phrase: string): KeyPairEd25519;
    static createRandomKeyPair(): KeyPairEd25519;
    static saveKeyPairLocally(accountId: string, keyPair: KeyPairEd25519): Promise<void>;
    static getKeyPair(accountId: string): Promise<KeyPairEd25519 | null>;
    static handshake(accountId: string, secret: string): Promise<void>;
    static getCombinedKey(accountId: string): Promise<NearApiJs.utils.key_pair.PublicKey>;
    static multisigSign(transaction: NearApiJs.transactions.Transaction, privateKey: NearApiJs.utils.KeyPairEd25519, combinedPublicKey: NearApiJs.utils.PublicKey, auth?: AuthData): Promise<SignedTransaction | null>;
}
