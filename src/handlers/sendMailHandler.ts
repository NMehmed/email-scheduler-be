import { FastifyReply, FastifyRequest } from 'fastify'
import { SendEmailBodySchema } from '../types/sendMailRequestBodySchema'
import mailService from '../services/mailService'

type SendMailRequest = FastifyRequest<{
  Body: SendEmailBodySchema
}>

export default async function (request: SendMailRequest, reply: FastifyReply) {
  try {
    await mailService.send(request.body)

    return { awesome: true }
  } catch (error) {
    console.error(error)

    return { awesome: false, error }
  }
}