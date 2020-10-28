import handler from '../handlers/sendMailHandler'
import * as bodySchema from '../schemas/sendMailRequestBodySchema.json'

module.exports = {
  method: 'POST',
  url: '/send-mail',
  schema: {
    body: bodySchema
  },
  handler,
}