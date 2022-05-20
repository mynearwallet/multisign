"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiSignStep3 = exports.multiSignStep2 = exports.multiSignStep1 = exports.addPublicKeys = void 0;
const crypto_1 = __importDefault(require("crypto"));
const base_1 = require("./src/base");
const randombytes = () => {
    return crypto_1.default.randomFillSync;
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
