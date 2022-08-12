"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountUDomain = exports.dotDomains = exports.dotDomain = exports.DOMAIN = void 0;
var DOMAIN;
(function (DOMAIN) {
    DOMAIN["TESTNET"] = "testnet";
    DOMAIN["NEAR"] = "near";
})(DOMAIN = exports.DOMAIN || (exports.DOMAIN = {}));
const dotDomain = (domain) => `.${domain}`;
exports.dotDomain = dotDomain;
const dotDomains = (domains) => domains.map(exports.dotDomain);
exports.dotDomains = dotDomains;
const accountUDomain = (accountId, domain) => `${accountId}${(0, exports.dotDomain)(domain)}`;
exports.accountUDomain = accountUDomain;
