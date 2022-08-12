export declare type HandshakeResponse = {
    combinedKey: string;
};
export declare type AuthData = {
    goog: string;
};
export declare type AuthStatus = {
    goog: boolean;
};
export declare type GetCombinedKeyResponse = {
    combinedKey: string;
};
export declare type SignTransactionResponse = {
    data: string | null;
    success: boolean;
    reason?: string;
};
declare namespace ConfidantService {
    const handshake: (publicKey: string, pkhash: string) => Promise<HandshakeResponse>;
    const getCombinedKey: (publicKey: string) => Promise<GetCombinedKeyResponse>;
    const createAccount: (accountId: string, publicKey: string) => Promise<{
        success: boolean;
        fullAccountId: string;
    }>;
    const signTransaction: (message: string, data: string, clientPublicKey: string, auth?: AuthData | undefined) => Promise<SignTransactionResponse>;
    const qrCode: (url: string) => Promise<Blob>;
    const hasAuth: (publicKey: string) => Promise<AuthStatus>;
    const createGoogTwoFA: (accountId: string, publicKey: string) => Promise<Blob>;
    const activateGoogTwoFA: (publicKey: string, token: string) => Promise<{
        success: boolean;
        reason?: string;
    }>;
    const deactivateGoogTwoFA: (pkhash: string) => Promise<{
        success: boolean;
    }>;
}
export default ConfidantService;
