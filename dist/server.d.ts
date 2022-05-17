import { addPublicKeys as addPublicKeysBase, multiSignStep3 as multiSignStep3Base } from './src/base';
export declare const addPublicKeys: typeof addPublicKeysBase;
export declare const multiSignStep1: () => {
    data: Uint8Array;
    secret: import("./src/base").Secret;
};
export declare const multiSignStep2: (step1data: Uint8Array, msg: Uint8Array, publicKey: Uint8Array, secretKey: Uint8Array) => Uint8Array | null;
export declare const multiSignStep3: typeof multiSignStep3Base;
