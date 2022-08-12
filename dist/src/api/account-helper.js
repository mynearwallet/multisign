"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./lib/request");
var AccountHelper;
(function (AccountHelper) {
    AccountHelper.getActivity = (accountId) => {
        return (0, request_1.helperRequest)(`/account/${accountId}/activity`);
    };
})(AccountHelper || (AccountHelper = {}));
exports.default = AccountHelper;
