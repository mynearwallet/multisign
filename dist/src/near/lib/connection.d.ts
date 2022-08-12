import * as NearApiJs from 'near-api-js';
export declare const getConnection: (accountId: string, access?: NearApiJs.utils.key_pair.KeyPair | undefined) => Promise<NearApiJs.Near>;
export declare const getAccount: (accountId?: string, access?: NearApiJs.utils.key_pair.KeyPair | undefined) => Promise<NearApiJs.Account>;
