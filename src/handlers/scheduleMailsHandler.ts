import { FastifyReply, FastifyRequest } from 'fastify'
import { ScheduleRecurrentEmailsBodySchema } from '../types/scheduleRecurrentMailsBodySchema'
import dbService from '../services/dbService'

type ScheduleMailRequest = FastifyRequest<{
  Body: ScheduleRecurrentEmailsBodySchema
}>

export default async function (request: ScheduleMailRequest, reply: FastifyReply) {
  try {
    await dbService.addEmailSchedule(request.body)

    return { awesome: true }
  } catch (error) {
    console.log(error)

    return { awesome: false }
  }
}