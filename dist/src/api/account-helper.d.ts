export declare type ActivityResponse = {
    action_index: number;
    action_kind: string;
    args: Record<string, string | number>;
    block_hash: string;
    block_timestamp: string;
    hash: string;
    receiver_id: string;
    signer_id: string;
};
declare namespace AccountHelper {
    const getActivity: (accountId: string) => Promise<ActivityResponse[]>;
}
export default AccountHelper;
