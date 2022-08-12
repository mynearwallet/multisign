export declare type ContractMetadata = {
    decimals: number;
    icon: string;
    name: string;
    spec: string;
    symbol: string;
};
declare namespace Nep141 {
    const getMetadata: (contractId: string) => Promise<ContractMetadata>;
    const getBalance: (contractId: string, accountId?: string | undefined) => Promise<string>;
}
export default Nep141;
