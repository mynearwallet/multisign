export declare enum DOMAIN {
    TESTNET = "testnet",
    NEAR = "near"
}
export declare const dotDomain: (domain: DOMAIN) => string;
export declare const dotDomains: (domains: DOMAIN[]) => string[];
export declare const accountUDomain: (accountId: string, domain: DOMAIN) => string;
