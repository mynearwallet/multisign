"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domains_1 = require("../near/lib/domains");
const baseConfig = process.env.REACT_APP_ENV === 'production'
    ? {
        networkId: domains_1.DOMAIN.NEAR,
        nodeUrl: 'https://rpc.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        headers: {},
    }
    : {
        networkId: domains_1.DOMAIN.TESTNET,
        nodeUrl: 'https://rpc.testnet.near.org',
        // helperUrl: 'https://helper.testnet.near.org',
        helperUrl: 'https://testnet-api.kitwallet.app',
        headers: {},
    };
const getNetworkConfig = () => baseConfig;
exports.default = getNetworkConfig;
