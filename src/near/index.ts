import * as NearApiJs from 'near-api-js';
import { KeyPairEd25519, PublicKey } from 'near-api-js/lib/utils';
import { Action, SignedTransaction } from 'near-api-js/lib/transaction';
import {
  AccessKeyView,
  EpochValidatorInfo,
  QueryResponseKind
} from 'near-api-js/lib/providers/provider';
import { getAccount, getConnection } from './lib/connection';
import { DOMAIN, dotDomain } from './lib/domains';
import Confidant from '../confidant';
import ConfidantService, { AuthData } from '../api/confidant-service';
import AccountHelper from '../api/account-helper';
import getNetworkConfig from '../lib/network';

export type BalanceMap = Record<string, Awaited<ReturnType<typeof Near.getBalance>>>;

export enum TransactionActionType {
  ADD_KEY = 'ADD_KEY',
  DELETE_KEY = 'DELETE_KEY',
  TRANSFER = 'TRANSFER',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
}

namespace Near {
  export const getBalance = async (accountId: string) => {
    const account = await getAccount(accountId);

    return await account.getAccountBalance();
  };

  export const addPublicKey = async(
    accountId: string,
    accessKeyPair: KeyPairEd25519,
    publicKey: PublicKey
  ) => {
    const account = await getAccount(accountId, accessKeyPair);
    await account.addKey(publicKey);
  };

  // todo @Lapko move from Near
  export const getTransactions = async (accountId: string) => {
    const activity = await AccountHelper.getActivity(accountId);

    return activity.map((t, i) => ({
      ...t,
      kind: t.action_kind.split('_')
        .map((s) =>
          s.substr(0, 1) + s.substr(1).toLowerCase()).join(''),
      block_timestamp: parseInt(t.block_timestamp.substr(0, 13), 10),
      hash_with_index: t.action_index + ':' + t.hash,
      checkStatus: !(i && t.hash === activity[i - 1].hash)
    }));
  };

  export const signAndSendTransaction = async (
    accountId: string,
    reciever: string,
    action: Action|Action[],
    auth?: AuthData,
  ) => {
    const combinedPublicKey = await Confidant.getCombinedKey(accountId);
    const accessKey = await Near.getAccessKey(accountId, combinedPublicKey);

    const transaction = NearApiJs.transactions.createTransaction(
      accountId,
      combinedPublicKey,
      reciever,
      accessKey.nonce + 1,
      Array.isArray(action) ? action : [action],
      NearApiJs.utils.serialize.base_decode(accessKey.block_hash)
    );

    const keyPair = await Confidant.getKeyPair(accountId);
    if (!keyPair) {
      console.error('Cannot create keypair with nullable accountId');
      alert('Cannot create keypair with nullable accountId');

      return;
    }

    const signedTransaction = await Confidant.multisigSign(
      transaction,
      keyPair,
      combinedPublicKey,
      auth
    );

    if (!signedTransaction) {
      console.error('Cannot sign transaction');
      alert('Cannot sign transaction');

      return;
    }

    try {
      const result = await Near.sendSignedTransaction(signedTransaction);
      console.log(result);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };

  export const sendSignedTransaction = (transaction: SignedTransaction) => {
    const signedSerializedTransaction = transaction.encode();
    // sends transaction to NEAR blockchain via JSON RPC call and records the result
    const provider = new NearApiJs.providers.JsonRpcProvider(
      getNetworkConfig().nodeUrl
    );

    return provider.sendJsonRpc('broadcast_tx_commit', [
      Buffer.from(signedSerializedTransaction).toString('base64'),
    ]);
  };

  export const getAccessKey = async <T extends QueryResponseKind & AccessKeyView>(
    accountId: string,
    publicKey: PublicKey
  ): Promise<T> => {
    const provider = new NearApiJs.providers.JsonRpcProvider(
      getNetworkConfig().nodeUrl
    );

    return await provider.query<T>(
      `access_key/${accountId}/${publicKey.toString()}`,
      ''
    );
  };

  export const isAccountExist = async (accountId: string): Promise<boolean> => {
    try {
      const account = await getAccount(accountId);
      const state = await account.state();

      return Boolean(state);
    } catch (_) {
      return false;
    }
  };

  export const createAccount = async (
    accountId: string,
    publicKey: string,
    domain: string
  ) => {
    switch (domain) {
      case dotDomain(DOMAIN.TESTNET):
      case dotDomain(DOMAIN.NEAR):
      default:
        return await ConfidantService.createAccount(accountId, publicKey);
    }
  };

  export const getValidators = async (accountId: string): Promise<EpochValidatorInfo> => {
    const { connection } = await getConnection(accountId);

    // @ts-ignore todo
    return connection.provider.validators();
  };
}

export default Near;
