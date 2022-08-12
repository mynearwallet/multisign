import { KeyPairEd25519 as KeyPairEd25519Lib } from 'near-api-js/lib/utils/key_pair';
/**
 * Wrapper for Ed25519 KeyPairs from NearApiJs
 * cause lib have no generic types
 */
export default class createKeyPairEd25519 {
    static fromString(secretKey: string): KeyPairEd25519Lib;
}
export declare type FE = Float64Array;
export declare type GE = [FE, FE, FE, FE];
export declare const gf0: any, gf1: any, D: any, D2: any, X: any, Y: any, I: any;
export declare function Z(o: FE, a: FE, b: FE): void;
export declare function pack(r: Uint8Array, p: GE): void;
export declare function reduce(r: Uint8Array): void;
export declare function unpackneg(r: GE, p: Uint8Array): 0 | -1;
