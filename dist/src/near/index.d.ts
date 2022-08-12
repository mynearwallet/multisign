import { KeyPairEd25519, PublicKey } from 'near-api-js/lib/utils';
import { Action, SignedTransaction } from 'near-api-js/lib/transaction';
import { AccessKeyView, EpochValidatorInfo, QueryResponseKind } from 'near-api-js/lib/providers/provider';
import { AuthData } from '../api/confidant-service';
export declare type BalanceMap = Record<string, Awaited<ReturnType<typeof Near.getBalance>>>;
export declare enum TransactionActionType {
    ADD_KEY = "ADD_KEY",
    DELETE_KEY = "DELETE_KEY",
    TRANSFER = "TRANSFER",
    CREATE_ACCOUNT = "CREATE_ACCOUNT"
}
declare namespace Near {
    const getBalance: (accountId: string) => Promise<import("near-api-js/lib/account").AccountBalance>;
    const addPublicKey: (accountId: string, accessKeyPair: KeyPairEd25519, publicKey: PublicKey) => Promise<void>;
    const getTransactions: (accountId: string) => Promise<{
        kind: string;
        block_timestamp: number;
        hash_with_index: string;
        checkStatus: boolean;
        action_index: number;
        action_kind: string;
        args: Record<string, string | number>;
        block_hash: string;
        hash: string;
        receiver_id: string;
        signer_id: string;
    }[]>;
    const signAndSendTransaction: (accountId: string, reciever: string, action: Action | Action[], auth?: AuthData | undefined) => Promise<void>;
    const sendSignedTransaction: (transaction: SignedTransaction) => Promise<unknown>;
    const getAccessKey: <T extends QueryResponseKind & AccessKeyView>(accountId: string, publicKey: PublicKey) => Promise<T>;
    const isAccountExist: (accountId: string) => Promise<boolean>;
    const createAccount: (accountId: string, publicKey: string, domain: string) => Promise<{
        success: boolean;
        fullAccountId: string;
    }>;
    const getValidators: (accountId: string) => Promise<EpochValidatorInfo>;
}
export default Near;
