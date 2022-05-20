"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiSignStep3 = exports.multiSignStep2 = exports.multiSignStep1 = exports.addPublicKeys = void 0;
const base_1 = require("./src/base");
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
