import {
    addPublicKeys as addPublicKeysBase,
    multiSignStep1 as multiSignStep1Base,
    multiSignStep2 as multiSignStep2Base,
    multiSignStep3 as multiSignStep3Base,
} from './src/base';

const randombytes: (r: Uint8Array) => void = function (r: Uint8Array) {
    for (let i = 0; i < r.length; i += 65536) {
        crypto.getRandomValues(r.subarray(i, i + 65536));
    }
};

export const addPublicKeys = addPublicKeysBase;

export const multiSignStep1 = () => {
    return multiSignStep1Base(randombytes);
}
export const multiSignStep2 = (
    step1data: Uint8Array,
    msg: Uint8Array,
    publicKey: Uint8Array,
    secretKey: Uint8Array
) => {
    return multiSignStep2Base(step1data, msg, publicKey, secretKey, randombytes);
}

export const  multiSignStep3 = multiSignStep3Base;
