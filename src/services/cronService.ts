import { CronJob } from 'cron'
import dbService from './dbService'
import mailService from './mailService'
import Weekdays from '../enums/weekdays'
import { MailSchedule } from '../types/mailSchedule'
import { SendEmailBodySchema } from '../types/sendMailRequestBodySchema'

const cronJobs: { [key: string]: CronJob } = {}
const toCronPattern = ({ weekdays, dayOfMonth, tickTime }: any) => {
  const daysInWeek = weekdays && weekdays.length > 0 ?
    weekdays.map((day: any) => { return Weekdays[day] }).join(',')
    : '*'
  const dayInMonth = dayOfMonth > 0 ? dayOfMonth : '*'
  const [hour, minutes] = tickTime ? tickTime.split(':') : ['10', '0']

  return `${minutes} ${hour} ${dayInMonth} * ${daysInWeek}`
}
const initMailCronJob = async (mailSchedule: MailSchedule) => {
  const cronPattern = toCronPattern(mailSchedule)

  const cronJob = new CronJob(cronPattern, async () => {
    try {
      const mail = {
        emailTo: mailSchedule.emailTo,
        subject: mailSchedule.subject,
        message: mailSchedule.message,
        whenToBeSent: new Date().toISOString(),
      } as SendEmailBodySchema

      await mailService.send(mail)
    } catch (error) {
      console.log(error)
    }
  }, async () => {
    try {
      await dbService.increaseOccurrancy(mailSchedule._id)

      await cronService.clearMailCronJobs()
    } catch (error) {
      console.log(error)
    }
  })

  cronJob.start()

  cronJobs[mailSchedule._id] = cronJob
}

const cronService = {
  startMailCronJobs: async () => {
    const mailScedules = await dbService.getActiveEmailSchedules()

    mailScedules.forEach(initMailCronJob)
  },

  startNewMailCronJobs: async () => {
    const activeEmailSchedules = await dbService.getActiveEmailSchedules()
    const IdsOfRunningMailSchedules = Object.keys(cronJobs)

    activeEmailSchedules
      .filter(emailSchedule =>
        !IdsOfRunningMailSchedules.some(id => id === emailSchedule._id))
      .forEach(initMailCronJob)
  },

  clearMailCronJobs: async () => {
    const activeEmailSchedules = await dbService.getActiveEmailSchedules()
    const IdsOfRunningMailSchedules = Object.keys(cronJobs)

    IdsOfRunningMailSchedules
      .filter(cronId =>
        !activeEmailSchedules.some(emailSchedule => emailSchedule._id === cronId))
      .forEach(expiredCronId =>
        cronJobs[expiredCronId].stop())
  }
}

export default cronService