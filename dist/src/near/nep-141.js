"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./lib/connection");
var Nep141;
(function (Nep141) {
    Nep141.getMetadata = (contractId) => __awaiter(this, void 0, void 0, function* () {
        const account = yield (0, connection_1.getAccount)();
        return account.viewFunction(contractId, 'ft_metadata');
    });
    Nep141.getBalance = (contractId, accountId) => __awaiter(this, void 0, void 0, function* () {
        const account = yield (0, connection_1.getAccount)(accountId);
        return account.viewFunction(contractId, 'ft_balance_of', { account_id: accountId });
    });
})(Nep141 || (Nep141 = {}));
exports.default = Nep141;
