import { DOMAIN } from '../near/lib/domains';
declare const getNetworkConfig: () => {
    networkId: DOMAIN;
    nodeUrl: string;
    helperUrl: string;
    headers: {};
};
export default getNetworkConfig;
