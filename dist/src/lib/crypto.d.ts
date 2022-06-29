export declare type FE = Float64Array;
export declare type GE = [FE, FE, FE, FE];
export declare const gf0: any, gf1: any, D: any, D2: any, X: any, Y: any, I: any;
export declare function Z(o: FE, a: FE, b: FE): void;
export declare function pack(r: Uint8Array, p: GE): void;
export declare function reduce(r: Uint8Array): void;
export declare function unpackneg(r: GE, p: Uint8Array): 0 | -1;
