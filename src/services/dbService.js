"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
let emailsScheduleCollection;
const dbService = {
    start: (mongoUrl) => {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(mongoUrl, function (err, db) {
                if (err)
                    reject(err);
                emailsScheduleCollection = db.db('emails').collection('schedule');
                console.log('MONGO CONNECTED');
                resolve(true);
            });
        });
    },
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
                        'whenToStopMails.whenToStop': { $eq: 'never' }
                    },
                    {
                        $and: [
                            {
                                'whenToStopMails.whenToStop': { $eq: 'afterSomeOccurency' }
                            },
                            {
                                $expr: {
                                    $lt: ['$occurrancy', '$whenToStopMails.occurrancy']
                                }
                            }
                        ]
                    },
                    {
                        $and: [
                            {
                                'whenToStopMails.whenToStop': { $eq: 'onDate' }
                            },
                            {
                                'whenToStopMails.stopDate': { $gt: new Date().toISOString() }
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
    },
    increaseOccurrancy: (_id) => {
        return new Promise((res, rej) => {
            emailsScheduleCollection.updateOne({
                _id
            }, {
                $inc: {
                    occurrancy: 1
                }
            }, (err, response) => {
                if (err)
                    return rej(err);
                return res(response);
            });
        });
    }
};
exports.default = dbService;
