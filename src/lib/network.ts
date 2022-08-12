import { DOMAIN } from '../near/lib/domains';

const baseConfig =
    process.env.REACT_APP_ENV === 'production'
        ? {
            networkId: DOMAIN.NEAR,
            nodeUrl: 'https://rpc.mainnet.near.org',
            helperUrl: 'https://helper.mainnet.near.org',
            headers: {},
        }
        : {
            networkId: DOMAIN.TESTNET,
            nodeUrl: 'https://rpc.testnet.near.org',
            // helperUrl: 'https://helper.testnet.near.org',
            helperUrl: 'https://testnet-api.kitwallet.app',
            headers: {},
        };

const getNetworkConfig = () => baseConfig;

export default getNetworkConfig;
