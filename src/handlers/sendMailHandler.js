"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailService_1 = __importDefault(require("../services/mailService"));
async function default_1(request, reply) {
    try {
        await mailService_1.default.send(request.body);
        return { awesome: true };
    }
    catch (error) {
        console.error(error);
        return { awesome: false, error };
    }
}
exports.default = default_1;
