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
exports.TransactionActionType = void 0;
const NearApiJs = __importStar(require("near-api-js"));
const connection_1 = require("./lib/connection");
const domains_1 = require("./lib/domains");
const confidant_1 = __importDefault(require("../confidant"));
const confidant_service_1 = __importDefault(require("../api/confidant-service"));
const account_helper_1 = __importDefault(require("../api/account-helper"));
const network_1 = __importDefault(require("../lib/network"));
var TransactionActionType;
(function (TransactionActionType) {
    TransactionActionType["ADD_KEY"] = "ADD_KEY";
    TransactionActionType["DELETE_KEY"] = "DELETE_KEY";
    TransactionActionType["TRANSFER"] = "TRANSFER";
    TransactionActionType["CREATE_ACCOUNT"] = "CREATE_ACCOUNT";
})(TransactionActionType = exports.TransactionActionType || (exports.TransactionActionType = {}));
var Near;
(function (Near) {
    Near.getBalance = (accountId) => __awaiter(this, void 0, void 0, function* () {
        const account = yield (0, connection_1.getAccount)(accountId);
        return yield account.getAccountBalance();
    });
    Near.addPublicKey = (accountId, accessKeyPair, publicKey) => __awaiter(this, void 0, void 0, function* () {
        const account = yield (0, connection_1.getAccount)(accountId, accessKeyPair);
        yield account.addKey(publicKey);
    });
    // todo @Lapko move from Near
    Near.getTransactions = (accountId) => __awaiter(this, void 0, void 0, function* () {
        const activity = yield account_helper_1.default.getActivity(accountId);
        return activity.map((t, i) => (Object.assign(Object.assign({}, t), { kind: t.action_kind.split('_')
                .map((s) => s.substr(0, 1) + s.substr(1).toLowerCase()).join(''), block_timestamp: parseInt(t.block_timestamp.substr(0, 13), 10), hash_with_index: t.action_index + ':' + t.hash, checkStatus: !(i && t.hash === activity[i - 1].hash) })));
    });
    Near.signAndSendTransaction = (accountId, reciever, action, auth) => __awaiter(this, void 0, void 0, function* () {
        const combinedPublicKey = yield confidant_1.default.getCombinedKey(accountId);
        const accessKey = yield Near.getAccessKey(accountId, combinedPublicKey);
        const transaction = NearApiJs.transactions.createTransaction(accountId, combinedPublicKey, reciever, accessKey.nonce + 1, Array.isArray(action) ? action : [action], NearApiJs.utils.serialize.base_decode(accessKey.block_hash));
        const keyPair = yield confidant_1.default.getKeyPair(accountId);
        if (!keyPair) {
            console.error('Cannot create keypair with nullable accountId');
            alert('Cannot create keypair with nullable accountId');
            return;
        }
        const signedTransaction = yield confidant_1.default.multisigSign(transaction, keyPair, combinedPublicKey, auth);
        if (!signedTransaction) {
            console.error('Cannot sign transaction');
            alert('Cannot sign transaction');
            return;
        }
        try {
            const result = yield Near.sendSignedTransaction(signedTransaction);
            console.log(result);
        }
        catch (e) {
            console.error(e);
            alert(e);
        }
    });
    Near.sendSignedTransaction = (transaction) => {
        const signedSerializedTransaction = transaction.encode();
        // sends transaction to NEAR blockchain via JSON RPC call and records the result
        const provider = new NearApiJs.providers.JsonRpcProvider((0, network_1.default)().nodeUrl);
        return provider.sendJsonRpc('broadcast_tx_commit', [
            Buffer.from(signedSerializedTransaction).toString('base64'),
        ]);
    };
    Near.getAccessKey = (accountId, publicKey) => __awaiter(this, void 0, void 0, function* () {
        const provider = new NearApiJs.providers.JsonRpcProvider((0, network_1.default)().nodeUrl);
        return yield provider.query(`access_key/${accountId}/${publicKey.toString()}`, '');
    });
    Near.isAccountExist = (accountId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const account = yield (0, connection_1.getAccount)(accountId);
            const state = yield account.state();
            return Boolean(state);
        }
        catch (_) {
            return false;
        }
    });
    Near.createAccount = (accountId, publicKey, domain) => __awaiter(this, void 0, void 0, function* () {
        switch (domain) {
            case (0, domains_1.dotDomain)(domains_1.DOMAIN.TESTNET):
            case (0, domains_1.dotDomain)(domains_1.DOMAIN.NEAR):
            default:
                return yield confidant_service_1.default.createAccount(accountId, publicKey);
        }
    });
    Near.getValidators = (accountId) => __awaiter(this, void 0, void 0, function* () {
        const { connection } = yield (0, connection_1.getConnection)(accountId);
        // @ts-ignore todo
        return connection.provider.validators();
    });
})(Near || (Near = {}));
exports.default = Near;
