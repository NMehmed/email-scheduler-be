import fastify from 'fastify'
import requireAll from 'require-all'
import path from 'path'
import BrokerService from './services/brokerService'
import dbService from './services/dbService'
import cronService from './services/cronService'

const brokerService = new BrokerService()

if (process.env.MESSAGE_QUEUE
  && process.env.QUEUE_NAME
  && process.env.MONGODB_URL) {
  Promise.all([
    // TODO: move to DI
    dbService.start(process.env.MONGODB_URL as string),
    brokerService.start(process.env.MESSAGE_QUEUE as string, process.env.QUEUE_NAME as string)
  ]).then(() => {
    const server = fastify()
    const routes = Object.values(requireAll({ dirname: path.join(__dirname, 'routes') }))

    server.register(require('fastify-cors'))
    // TODO: move to DI
    routes.forEach(route => server.route(route))

    try {
      // TODO: start in separate service
      cronService.startMailCronJobs()
    } catch (error) {
      console.error('Failed to lunch cron jobs')
      console.error(error)
    }

    server.listen(8080, (err, address) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`Server listening at ${address}`)
    })
  })
} else {
  console.error('Set env variables before start')
  process.exit(1)
}