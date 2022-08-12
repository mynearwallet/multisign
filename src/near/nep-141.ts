import { getAccount } from './lib/connection';

export type ContractMetadata = {
  decimals: number;
  icon: string;
  name: string;
  spec: string;
  symbol: string;
}

namespace Nep141 {
  export const getMetadata = async (contractId: string): Promise<ContractMetadata> => {
    const account = await getAccount();

    return account.viewFunction(contractId, 'ft_metadata');
  };

  export const getBalance = async (
    contractId: string,
    accountId?: string
  ): Promise<string> => {
    const account = await getAccount(accountId);

    return account.viewFunction(
      contractId,
      'ft_balance_of',
      { account_id: accountId }
    );
  };
}

export default Nep141;
