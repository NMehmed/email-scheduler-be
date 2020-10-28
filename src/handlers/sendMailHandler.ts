import { FastifyReply, FastifyRequest } from 'fastify'
import { SendEmailBodySchema } from '../types/sendMailRequestBodySchema'

type SendMailRequest = FastifyRequest<{
  Body: SendEmailBodySchema
}>

export default async function (request: SendMailRequest, reply: FastifyReply) {
  return { awesome: true }
}