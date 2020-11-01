"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbService_1 = __importDefault(require("../services/dbService"));
async function default_1(request, reply) {
    try {
        await dbService_1.default.addEmailSchedule(request.body);
        return { awesome: true };
    }
    catch (error) {
        console.log(error);
        return { awesome: false };
    }
}
exports.default = default_1;
