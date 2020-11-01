import handler from '../handlers/scheduleMailsHandler'
import * as bodySchema from '../schemas/scheduleRecurrentMailsBodySchema.json'

module.exports = {
  method: 'POST',
  url: '/schedule-mail',
  schema: {
    body: bodySchema
  },
  handler,
}