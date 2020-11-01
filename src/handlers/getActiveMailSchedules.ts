import { FastifyReply, FastifyRequest } from 'fastify'
import dbService from '../services/dbService'

export default async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    const activeSchedules = await dbService.getActiveEmailSchedules()

    return { activeSchedules }
  } catch (error) {
    console.log(error)

    return { awesome: false }
  }
}