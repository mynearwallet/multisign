import * as NearApiJs from 'near-api-js';
import { KeyPair } from 'near-api-js';
import Confidant from '../../confidant';
import getNetworkConfig from '../../lib/network';


export const getConnection = (accountId: string, access?: KeyPair) => {
  const memoryKeyStore = new NearApiJs.keyStores.InMemoryKeyStore();
  memoryKeyStore.setKey(
    getNetworkConfig().networkId,
    accountId,
    access || NearApiJs.KeyPair.fromRandom('ed25519')
  );

  const connection = NearApiJs.connect({
    ...getNetworkConfig(),
    keyStore: memoryKeyStore,
  });

  return connection;
};

export const getAccount = async (accountId = 'dontcare', access?: KeyPair) => {
  const accessKeyPair = access
    || await Confidant.getKeyPair(accountId)
    || undefined;

  const connection = await getConnection(accountId, accessKeyPair);

  return connection.account(accountId);
};
