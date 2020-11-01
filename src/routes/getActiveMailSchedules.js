"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getActiveMailSchedules_1 = __importDefault(require("../handlers/getActiveMailSchedules"));
module.exports = {
    method: 'GET',
    url: '/active-mails-schedule',
    handler: getActiveMailSchedules_1.default,
};
