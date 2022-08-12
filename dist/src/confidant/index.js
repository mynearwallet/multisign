"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NearApiJs = __importStar(require("near-api-js"));
// @ts-ignore
const near_seed_phrase_1 = require("near-seed-phrase");
const js_sha256_1 = __importDefault(require("js-sha256"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const near_1 = __importDefault(require("../near"));
const confidant_service_1 = __importDefault(require("../api/confidant-service"));
const network_1 = __importDefault(require("../lib/network"));
const client_1 = require("../../client");
const crypto_1 = __importDefault(require("../lib/crypto"));
class Confidant {
    static keyPairBySeedPhrase(phrase) {
        return crypto_1.default.fromString((0, near_seed_phrase_1.parseSeedPhrase)(phrase).secretKey);
    }
    static createRandomKeyPair() {
        return NearApiJs.utils.KeyPairEd25519.fromRandom();
    }
    static saveKeyPairLocally(accountId, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStore = new NearApiJs.keyStores.BrowserLocalStorageKeyStore();
            yield keyStore.setKey((0, network_1.default)().networkId, accountId, keyPair);
        });
    }
    static getKeyPair(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStore = new NearApiJs.keyStores.BrowserLocalStorageKeyStore();
            const key = yield keyStore.getKey((0, network_1.default)().networkId, accountId);
            /* eslint-disable max-len */
            /**
             * No generic type
             * @link {https://github.com/near/near-api-js/blob/master/src/key_stores/browser_local_storage_key_store.ts#L60}
             */
            /* eslint-enable max-len */
            return key;
        });
    }
    static handshake(accountId, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKeyPair = Confidant.createRandomKeyPair();
            yield Confidant.saveKeyPairLocally(accountId, newKeyPair);
            const handshakeResponse = yield confidant_service_1.default.handshake(newKeyPair.getPublicKey().toString(), js_sha256_1.default.sha256.hex(secret));
            const combinedKey = NearApiJs.utils.PublicKey
                .fromString(handshakeResponse.combinedKey);
            const secretKeyPair = crypto_1.default.fromString(secret);
            yield near_1.default.addPublicKey(accountId, secretKeyPair, combinedKey);
        });
    }
    static getCombinedKey(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyPair = yield Confidant.getKeyPair(accountId);
            if (!keyPair) {
                throw Error('Cannot create keypair with nullable accountId');
            }
            const response = yield confidant_service_1.default.getCombinedKey(keyPair.getPublicKey().toString());
            return NearApiJs.utils.PublicKey.fromString(response.combinedKey);
        });
    }
    static multisigSign(transaction, privateKey, combinedPublicKey, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const step1 = (0, client_1.multiSignStep1)();
            const encodedTransaction = transaction.encode();
            const serializedTxHash = new Uint8Array(js_sha256_1.default.sha256.array(encodedTransaction));
            const step2Data = yield confidant_service_1.default.signTransaction(NearApiJs.utils.serialize.base_encode(serializedTxHash), NearApiJs.utils.serialize.base_encode(step1.data), privateKey.getPublicKey().toString(), auth);
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
            const signature = (0, client_1.multiSignStep3)(NearApiJs.utils.serialize.base_decode(step2Data.data), step1.secret, serializedTxHash, combinedPublicKey.data, NearApiJs.utils.serialize.base_decode(privateKey.secretKey));
            if (signature === null) {
                return null;
            }
            const nacltest = tweetnacl_1.default.sign.detached.verify(serializedTxHash, signature, combinedPublicKey.data);
            console.log('NaclTest', nacltest);
            const signedTransaction = new NearApiJs.transactions.SignedTransaction({
                transaction,
                signature: new NearApiJs.transactions.Signature({
                    keyType: transaction.publicKey.keyType,
                    data: signature,
                }),
            });
            return signedTransaction;
        });
    }
}
exports.default = Confidant;
