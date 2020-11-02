import { MongoClient, MongoError } from 'mongodb'
import { ScheduleRecurrentEmailsBodySchema } from '../types/scheduleRecurrentMailsBodySchema'
import { MailSchedule } from '../types/mailSchedule'

let emailsScheduleCollection: any

const dbService = {
  start: (mongoUrl: string) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongoUrl, function (err, db) {
        if (err) return reject(err)

        emailsScheduleCollection = db.db('emails').collection('schedule')
        console.log('MONGO CONNECTED')

        return resolve(true)
      })
    })
  },

  addEmailSchedule: (emailSchedule: ScheduleRecurrentEmailsBodySchema) => {
    return new Promise((res, rej) => {
      if (emailsScheduleCollection) emailsScheduleCollection.insertOne({ ...emailSchedule, occurrancy: 0 }, (err: MongoError, response: any) => {
        if (err) return rej(err)

        return res(response)
      })
    })
  },

  getActiveEmailSchedules: (): Promise<Array<MailSchedule>> => {
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
      }).toArray((err: any, result: any) => {
        if (err) return rej(err)

        return res(result)
      })
    })
  },

  increaseOccurrancy: (_id: string) => {
    return new Promise((res, rej) => {
      emailsScheduleCollection.updateOne({
        _id
      }, {
        $inc: {
          occurrancy: 1
        }
      }, (err: Error, response: any) => {
        if (err) return rej(err)

        return res(response)
      })
    })
  }
}

export default dbService