"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbService_1 = __importDefault(require("../services/dbService"));
async function default_1(request, reply) {
    try {
        const activeSchedules = await dbService_1.default.getActiveEmailSchedules();
        return { activeSchedules };
    }
    catch (error) {
        console.error(error);
        return { awesome: false, error };
    }
}
exports.default = default_1;
