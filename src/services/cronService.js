"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const dbService_1 = __importDefault(require("./dbService"));
const mailService_1 = __importDefault(require("./mailService"));
const Weekdays_1 = __importDefault(require("../enums/Weekdays"));
const cronJobs = {};
const toCronPattern = ({ weekdays, dayOfMonth, tickTime }) => {
    const daysInWeek = weekdays && weekdays.length > 0 ?
        weekdays.map((day) => { return Weekdays_1.default[day]; }).join(',')
        : '*';
    const dayInMonth = dayOfMonth || '*';
    const [hour, minutes] = tickTime ? tickTime.split(':') : ['10', '0'];
    return `${minutes} ${hour} ${dayInMonth} * ${daysInWeek}`;
};
const initMailCronJob = async (mailSchedule) => {
    const cronPattern = toCronPattern(mailSchedule);
    const cronJob = new cron_1.CronJob(cronPattern, async () => {
        try {
            const mail = {
                emailTo: mailSchedule.emailTo,
                subject: mailSchedule.subject,
                message: mailSchedule.message,
                whenToBeSent: new Date().toISOString(),
            };
            await mailService_1.default.send(mail);
            await dbService_1.default.increaseOccurrancy(mailSchedule._id);
            await cronService.clearMailCronJobs();
        }
        catch (error) {
            console.log(error);
        }
    }, null, undefined, undefined, undefined, undefined, 0);
    cronJob.start();
    cronJobs[mailSchedule.id] = cronJob;
};
const cronService = {
    startMailCronJobs: async () => {
        const mailScedules = await dbService_1.default.getActiveEmailSchedules();
        mailScedules.forEach(initMailCronJob);
    },
    startNewMailCronJobs: async () => {
        const activeEmailSchedules = await dbService_1.default.getActiveEmailSchedules();
        const IdsOfRunningMailSchedules = Object.keys(cronJobs);
        activeEmailSchedules
            .filter(emailSchedule => !IdsOfRunningMailSchedules.some(id => id === emailSchedule.id))
            .forEach(initMailCronJob);
    },
    clearMailCronJobs: async () => {
        const activeEmailSchedules = await dbService_1.default.getActiveEmailSchedules();
        const IdsOfRunningMailSchedules = Object.keys(cronJobs);
        IdsOfRunningMailSchedules
            .filter(cronId => !activeEmailSchedules.some(emailSchedule => emailSchedule.id === cronId))
            .forEach(expiredCronId => cronJobs[expiredCronId].stop());
    }
};
exports.default = cronService;
