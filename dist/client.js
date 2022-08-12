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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.functionCall = exports.signAndSendTransaction = exports.multiSignStep3 = exports.multiSignStep2 = exports.multiSignStep1 = exports.addPublicKeys = void 0;
const NearApiJs = __importStar(require("near-api-js"));
const base_1 = require("./src/base");
const near_1 = __importDefault(require("./src/near"));
const randombytes = function (r) {
    for (let i = 0; i < r.length; i += 65536) {
        crypto.getRandomValues(r.subarray(i, i + 65536));
    }
};
exports.addPublicKeys = base_1.addPublicKeys;
const multiSignStep1 = () => {
    return (0, base_1.multiSignStep1)(randombytes);
};
exports.multiSignStep1 = multiSignStep1;
const multiSignStep2 = (step1data, msg, publicKey, secretKey) => {
    return (0, base_1.multiSignStep2)(step1data, msg, publicKey, secretKey, randombytes);
};
exports.multiSignStep2 = multiSignStep2;
exports.multiSignStep3 = base_1.multiSignStep3;
exports.signAndSendTransaction = near_1.default.signAndSendTransaction;
exports.functionCall = NearApiJs.transactions.functionCall;
exports.transfer = NearApiJs.transactions.transfer;
