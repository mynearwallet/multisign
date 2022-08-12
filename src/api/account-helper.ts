import { helperRequest } from './lib/request';

export type ActivityResponse = {
  action_index: number;
  action_kind: string;
  args: Record<string, string|number>;
  block_hash: string;
  block_timestamp: string;
  hash: string;
  receiver_id: string;
  signer_id: string;
}

namespace AccountHelper {
  export const getActivity = (accountId: string): Promise<ActivityResponse[]> => {
    return helperRequest(`/account/${accountId}/activity`);
  };
}

export default AccountHelper;
