"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbService_1 = __importDefault(require("../services/dbService"));
const cronService_1 = __importDefault(require("../services/cronService"));
async function default_1(request, reply) {
    try {
        await dbService_1.default.addEmailSchedule(request.body);
        await cronService_1.default.startNewMailCronJobs();
        return { awesome: true };
    }
    catch (error) {
        console.log(error);
        return { awesome: false, message: error };
    }
}
exports.default = default_1;
