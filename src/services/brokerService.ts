import amqp from 'amqplib'

class BrokerService {
  private connection: amqp.Connection | null
  private channel: amqp.Channel | null
  private queueName: string | null
  private messageQueue: string | null

  constructor() {
    this.connection = null
    this.channel = null
    this.queueName = null
    this.messageQueue = null
  }

  public async start(messageQueue: string, queueName: string) {
    this.messageQueue = messageQueue
    this.queueName = queueName
    this.connection = await amqp.connect(this.messageQueue)
    this.channel = await this.connection.createChannel()

    await this.channel.assertQueue(queueName, { durable: true })
  }

  public async send(message: any) {
    if (!this.channel) throw Error('Not initialised run start before sending message')
    if (!this.queueName) throw Error('Not initialised run start before sending message')

    await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
      contentType: 'application/json',
      persistent: true
    })
  }
}


export default BrokerService