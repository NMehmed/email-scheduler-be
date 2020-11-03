"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const dbService_1 = __importDefault(require("./dbService"));
const mailService_1 = __importDefault(require("./mailService"));
const weekdays_1 = __importDefault(require("../enums/weekdays"));
const cronJobs = {};
const toCronPattern = ({ weekdays, dayOfMonth, tickTime }) => {
    const daysInWeek = weekdays && weekdays.length > 0 ?
        weekdays.map((day) => { return weekdays_1.default[day]; }).join(',')
        : '*';
    const dayInMonth = dayOfMonth || '*';
    const [hour, minutes] = tickTime ? tickTime.split(':') : ['10', '0'];
    return `${minutes} ${hour} ${dayInMonth} * ${daysInWeek}`;
};
const initMailCronJob = async (mailSchedule) => {
    const cronPattern = toCronPattern(mailSchedule);
    console.log('cron pattern');
    console.log(cronPattern);
    const cronJob = new cron_1.CronJob(cronPattern, async () => {
        console.log('HIT');
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
    });
    cronJob.start();
    console.log(cronJob.nextDate());
    console.log('-----');
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
        console.log('new crons');
        console.log(activeEmailSchedules);
        console.log('----');
        console.log(IdsOfRunningMailSchedules);
        activeEmailSchedules
            .filter(emailSchedule => !IdsOfRunningMailSchedules.some(id => id === emailSchedule.id))
            .forEach(initMailCronJob);
    },
    clearMailCronJobs: async () => {
        console.log('clear');
        const activeEmailSchedules = await dbService_1.default.getActiveEmailSchedules();
        const IdsOfRunningMailSchedules = Object.keys(cronJobs);
        IdsOfRunningMailSchedules
            .filter(cronId => !activeEmailSchedules.some(emailSchedule => emailSchedule.id === cronId))
            .forEach(expiredCronId => cronJobs[expiredCronId].stop());
    }
};
exports.default = cronService;
