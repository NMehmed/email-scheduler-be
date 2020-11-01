import handler from '../handlers/getActiveMailSchedules'

module.exports = {
  method: 'GET',
  url: '/active-mails-schedule',
  handler,
}