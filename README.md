# Email Scheduler Rest API
This is web server which serves to send mails, schedule mails and you can get scheduled mails list.

## Endpoints

- [GET] `/active-mails-schedule` - Gets list of active email schedules
- [POST] `/send-mail` - Sends mails ([Request body schema](/src/schemas/sendMailRequestBodySchema.json))
- [POST] `/schedule-mail` - Schedules recurrent mail([Request body schema](/src/schemas/scheduleRecurrentMailsBodySchema.json))

## How start service

### Prerequisites

- Docker
- .env

To create `.env` file copy `.env.example` and rename.
In `.env` `MESSAGE_QUEUE` stands for rabbit mq url and `MONGODB_URL` is the mongodb url.

### Starting the server

- `npm i` - Installs dependencies
- `docker-compose up` - Starts in docker Mongdodb and rabbitmq images
- `npm start` - Compiles ts files and runs fastify server

### Scripts

- `npm run test` - Runs tests
- `npm run build` - Compiles ts files, and from json schema builds types
- `npm run build:watch` - Watches for changes on ts files and re-compiles
- `npm run compile:schemas` - Compiles json files