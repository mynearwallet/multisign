export declare type FE = Float64Array;
export declare type GE = [FE, FE, FE, FE];
export declare function randombytes(r: Uint8Array): void;
export declare function gf(init?: number[]): FE;
export declare const gf0: Float64Array, gf1: Float64Array, D: Float64Array, D2: Float64Array, X: Float64Array, Y: Float64Array, I: Float64Array;
export declare function Z(o: FE, a: FE, b: FE): void;
export declare function crypto_hash(out: Uint8Array, m: Uint8Array, n: number): 0;
export declare function add(p: GE, q: GE): void;
export declare function pack(r: Uint8Array, p: GE): void;
export declare function scalarbase(p: GE, s: Uint8Array): void;
export declare function modL(r: Uint8Array, x: Float64Array): void;
export declare function reduce(r: Uint8Array): void;
export declare function unpackneg(r: GE, p: Uint8Array): 0 | -1;
