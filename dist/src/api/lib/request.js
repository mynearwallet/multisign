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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helperRequest = exports.confidantRequest = void 0;
const network_1 = __importDefault(require("../../lib/network"));
const request = (host, options) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(host, options ? {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify((options === null || options === void 0 ? void 0 : options.body) || {})
    } : undefined);
    return response[(options === null || options === void 0 ? void 0 : options.responseType) || 'json']();
});
const buildHost = (host, arm) => `${host}${arm}`;
const getConfidantHost = (arm) => buildHost('http://localhost:7895', arm);
const getHelperHost = (arm) => buildHost((0, network_1.default)().helperUrl || '', arm);
// const getIndexerHost = (arm: string) => buildHost(INDEXER_SERVICE_URL || '', arm);
// const getFinanceHost = (arm: string) => buildHost(FINANCE_API || '', arm);
const confidantRequest = (arm, options) => __awaiter(void 0, void 0, void 0, function* () { return request(getConfidantHost(arm), options); });
exports.confidantRequest = confidantRequest;
const helperRequest = (arm, options) => __awaiter(void 0, void 0, void 0, function* () { return request(getHelperHost(arm), options); });
exports.helperRequest = helperRequest;
