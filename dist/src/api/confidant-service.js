"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./lib/request");
var ConfidantService;
(function (ConfidantService) {
    ConfidantService.handshake = (publicKey, pkhash) => {
        return (0, request_1.confidantRequest)('/api/handshake', {
            body: {
                publicKey,
                pkhash,
            },
        });
    };
    ConfidantService.getCombinedKey = (publicKey) => {
        return (0, request_1.confidantRequest)('/api/key', {
            body: { clientPublicKey: publicKey }
        });
    };
    ConfidantService.createAccount = (accountId, publicKey) => {
        return (0, request_1.confidantRequest)('/api/create/account', {
            body: { accountId, publicKey }
        });
    };
    ConfidantService.signTransaction = (message, data, clientPublicKey, auth) => {
        return (0, request_1.confidantRequest)('/api/sign', {
            body: {
                message: message,
                data,
                clientPublicKey,
                auth,
            }
        });
    };
    ConfidantService.qrCode = (url) => {
        return (0, request_1.confidantRequest)('/api/qrcode', {
            body: { url },
            responseType: 'blob',
        });
    };
    ConfidantService.hasAuth = (publicKey) => {
        return (0, request_1.confidantRequest)('/api/2fa/enabled', {
            body: { publicKey }
        });
    };
    ConfidantService.createGoogTwoFA = (accountId, publicKey) => {
        return (0, request_1.confidantRequest)('/api/2fa/goog/create', {
            body: { accountId, publicKey },
            responseType: 'blob',
        });
    };
    ConfidantService.activateGoogTwoFA = (publicKey, token) => {
        return (0, request_1.confidantRequest)('/api/2fa/goog/activate', {
            body: { publicKey, token },
        });
    };
    ConfidantService.deactivateGoogTwoFA = (pkhash) => {
        return (0, request_1.confidantRequest)('/api/2fa/goog/deactivate', {
            body: { pkhash },
        });
    };
})(ConfidantService || (ConfidantService = {}));
exports.default = ConfidantService;
