declare type Options = {
    body?: Record<string, any>;
    responseType?: 'blob' | 'json';
};
export declare const confidantRequest: (arm: string, options?: Options | undefined) => Promise<any>;
export declare const helperRequest: (arm: string, options?: Options | undefined) => Promise<any>;
export {};
