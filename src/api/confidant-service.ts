import { confidantRequest } from './lib/request';

export type HandshakeResponse = {
  combinedKey: string;
}

export type AuthData = {
  goog: string
};

export type AuthStatus = {
  goog: boolean;
}

export type GetCombinedKeyResponse = {
  combinedKey: string;
}

export type SignTransactionResponse = {
  data: string|null;
  success: boolean;
  reason?: string;
}

namespace ConfidantService {
  export const handshake = (
    publicKey: string,
    pkhash: string,
  ): Promise<HandshakeResponse> => {
    return confidantRequest('/api/handshake', {
      body: {
        publicKey,
        pkhash,
      },
    });
  };

  export const getCombinedKey = (publicKey: string): Promise<GetCombinedKeyResponse> => {
    return confidantRequest('/api/key', {
      body: { clientPublicKey: publicKey }
    });
  };

  export const createAccount = (
    accountId: string,
    publicKey: string,
  ): Promise<{ success: boolean, fullAccountId: string }> => {
    return confidantRequest('/api/create/account', {
      body: { accountId, publicKey }
    });
  };

  export const  signTransaction = (
    message: string,
    data: string,
    clientPublicKey: string,
    auth?: AuthData,
  ): Promise<SignTransactionResponse> => {
    return confidantRequest('/api/sign', {
      body: {
        message: message,
        data,
        clientPublicKey,
        auth,
      }
    });
  };

  export const qrCode = (url: string): Promise<Blob> => {
    return confidantRequest('/api/qrcode', {
      body: { url },
      responseType: 'blob',
    });
  };

  export const hasAuth = (publicKey: string): Promise<AuthStatus> => {
    return confidantRequest('/api/2fa/enabled', {
      body: { publicKey }
    });
  };

  export const createGoogTwoFA = (
    accountId: string,
    publicKey: string
  ): Promise<Blob> => {
    return confidantRequest('/api/2fa/goog/create', {
      body: { accountId, publicKey },
      responseType: 'blob',
    });
  };

  export const activateGoogTwoFA = (publicKey: string, token: string): Promise<{
    success: boolean;
    reason?: string;
  }> => {
    return confidantRequest('/api/2fa/goog/activate', {
      body: { publicKey, token },
    });
  };

  export const deactivateGoogTwoFA = (pkhash: string): Promise<{
    success: boolean
  }> => {
    return confidantRequest('/api/2fa/goog/deactivate', {
      body: { pkhash },
    });
  };
}

export default ConfidantService;
