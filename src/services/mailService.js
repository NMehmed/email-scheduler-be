"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brokerService_1 = __importDefault(require("./brokerService"));
const brokerService = new brokerService_1.default();
if (process.env.MESSAGE_QUEUE && process.env.QUEUE_NAME) {
    brokerService.start(process.env.MESSAGE_QUEUE, process.env.QUEUE_NAME);
}
const mailService = {
    send: (mail) => brokerService.send(mail)
};
exports.default = mailService;
