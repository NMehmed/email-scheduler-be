import fastify from 'fastify'
import requireAll from 'require-all'
import path from 'path'

const server = fastify()
const routes = Object.values(requireAll({ dirname: path.join(__dirname, 'routes') }))

server.register(require('fastify-cors'))

routes.forEach(route => server.route(route))

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})