"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const MongoClient = mongodb_1.default.MongoClient;
const url = 'mongodb://localhost:27017/';
let emailsScheduleCollection;
MongoClient.connect(url, function (err, db) {
    if (err)
        throw err;
    emailsScheduleCollection = db.db('emails').collection('schedule');
    console.log('MONGO CONNECTED');
});
const dbService = {
    addEmailSchedule: (emailSchedule) => {
        return new Promise((res, rej) => {
            if (emailsScheduleCollection)
                emailsScheduleCollection.insertOne({ ...emailSchedule, occurrancy: 0 }, (err, response) => {
                    if (err)
                        return rej(err);
                    return res(response);
                });
        });
    },
    getActiveEmailSchedules: () => {
        return new Promise((res, rej) => {
            emailsScheduleCollection.find({
                $or: [
                    {
                        "whenToStopMails.whenToStop": { $eq: "never" }
                    },
                    {
                        $and: [
                            {
                                "whenToStopMails.whenToStop": { $eq: "afterSomeOccurency" }
                            },
                            {
                                $expr: {
                                    $lt: ["$occurrancy", "$whenToStopMails.occurrancy"]
                                }
                            }
                        ]
                    },
                    {
                        $and: [
                            {
                                "whenToStopMails.whenToStop": { $eq: "onDate" }
                            },
                            {
                                "whenToStopMails.stopDate": { $gt: new Date().toISOString() }
                            }
                        ]
                    }
                ]
            }).toArray((err, result) => {
                if (err)
                    return rej(err);
                return res(result);
            });
        });
    }
};
exports.default = dbService;
