import mongodb, { MongoError } from 'mongodb'
import { ScheduleRecurrentEmailsBodySchema } from '../types/scheduleRecurrentMailsBodySchema'

const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/'
let emailsScheduleCollection: any

MongoClient.connect(url, function (err, db) {
  if (err) throw err

  emailsScheduleCollection = db.db('emails').collection('schedule')
  console.log('MONGO CONNECTED')
})

const dbService = {
  addEmailSchedule: (emailSchedule: ScheduleRecurrentEmailsBodySchema) => {
    return new Promise((res, rej) => {
      if (emailsScheduleCollection) emailsScheduleCollection.insertOne({ ...emailSchedule, occurrancy: 0 }, (err: MongoError, response: any) => {
        if (err) return rej(err)

        return res(response)
      })
    })
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
      }).toArray((err: any, result: any) => {
        if (err) return rej(err)

        return res(result)
      })
    })
  }
}

export default dbService