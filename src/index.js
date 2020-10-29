"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const require_all_1 = __importDefault(require("require-all"));
const path_1 = __importDefault(require("path"));
const server = fastify_1.default();
const routes = Object.values(require_all_1.default({ dirname: path_1.default.join(__dirname, 'routes') }));
const brokerService_1 = __importDefault(require("./services/brokerService"));
const brokerService = new brokerService_1.default();
if (process.env.MESSAGE_QUEUE && process.env.QUEUE_NAME) {
    brokerService.start(process.env.MESSAGE_QUEUE, process.env.QUEUE_NAME);
    console.log('broker starts');
}
server.register(require('fastify-cors'));
routes.forEach(route => server.route(route));
server.listen(8080, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
