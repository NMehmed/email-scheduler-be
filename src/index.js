"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const require_all_1 = __importDefault(require("require-all"));
const path_1 = __importDefault(require("path"));
const brokerService_1 = __importDefault(require("./services/brokerService"));
const dbService_1 = __importDefault(require("./services/dbService"));
const cronService_1 = __importDefault(require("./services/cronService"));
const brokerService = new brokerService_1.default();
if (process.env.MESSAGE_QUEUE
    && process.env.QUEUE_NAME
    && process.env.MONGODB_URL) {
    Promise.all([
        // TODO: move to DI
        dbService_1.default.start(process.env.MONGODB_URL),
        brokerService.start(process.env.MESSAGE_QUEUE, process.env.QUEUE_NAME)
    ]).then(() => {
        const server = fastify_1.default();
        const routes = Object.values(require_all_1.default({ dirname: path_1.default.join(__dirname, 'routes') }));
        server.register(require('fastify-cors'));
        // TODO: move to DI
        routes.forEach(route => server.route(route));
        try {
            // TODO: start in separate service
            cronService_1.default.startMailCronJobs();
        }
        catch (error) {
            console.error('Failed to lunch cron jobs');
            console.error(error);
        }
        server.listen(8080, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening at ${address}`);
        });
    });
}
else {
    console.error('Set env variables before start');
    process.exit(1);
}
