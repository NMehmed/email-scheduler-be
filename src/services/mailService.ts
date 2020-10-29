import BrokerService from './brokerService'
import { SendEmailBodySchema } from '../types/sendMailRequestBodySchema'

const brokerService = new BrokerService()

if (process.env.MESSAGE_QUEUE && process.env.QUEUE_NAME) {
  brokerService.start(process.env.MESSAGE_QUEUE, process.env.QUEUE_NAME)
}

const mailService = {
  send: (mail: SendEmailBodySchema) => brokerService.send(mail)
}

export default mailService