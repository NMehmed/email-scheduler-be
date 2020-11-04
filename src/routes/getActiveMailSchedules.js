"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getActiveMailSchedulesHandler_1 = __importDefault(require("../handlers/getActiveMailSchedulesHandler"));
module.exports = {
    method: 'GET',
    url: '/active-mails-schedule',
    handler: getActiveMailSchedulesHandler_1.default,
};
