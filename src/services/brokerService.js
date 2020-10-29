"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
class BrokerService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.queueName = null;
        this.messageQueue = null;
    }
    async start(messageQueue, queueName) {
        this.messageQueue = messageQueue;
        this.queueName = queueName;
        this.connection = await amqplib_1.default.connect(this.messageQueue);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(queueName, { durable: true });
    }
    async send(message) {
        if (!this.channel)
            throw Error('Not initialised run start before sending message');
        if (!this.queueName)
            throw Error('Not initialised run start before sending message');
        await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
            contentType: 'application/json',
            persistent: true
        });
    }
}
exports.default = BrokerService;
