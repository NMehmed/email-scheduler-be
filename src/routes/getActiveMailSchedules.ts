import handler from '../handlers/getActiveMailSchedulesHandler'

module.exports = {
  method: 'GET',
  url: '/active-mails-schedule',
  handler,
}