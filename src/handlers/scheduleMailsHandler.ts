import { FastifyReply, FastifyRequest } from 'fastify'
import { ScheduleRecurrentEmailsBodySchema } from '../types/scheduleRecurrentMailsBodySchema'
import dbService from '../services/dbService'
import cronService from '../services/cronService'

type ScheduleMailRequest = FastifyRequest<{
  Body: ScheduleRecurrentEmailsBodySchema
}>

export default async function (request: ScheduleMailRequest, reply: FastifyReply) {
  try {
    await dbService.addEmailSchedule(request.body)
    await cronService.startNewMailCronJobs()

    return { awesome: true }
  } catch (error) {
    console.log(error)

    return { awesome: false, error }
  }
}