import client, { Channel, Connection, ConsumeMessage } from 'amqplib'
import { printMessage } from './consumer'

export class RabbitMQ {
  private static instance: RabbitMQ
  private connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  static async init() {
    if (!this.instance) {
      const connection = await this.initConnection()
      this.instance = new RabbitMQ(connection)
    }
  }

  static get get() {
    if (!this.instance) {
      throw new Error('Please init RabbitMQ service first')
    }

    return this.instance
  }

  private static async initConnection() {
    const connection = await client.connect(
      process.env.RABBITMQ_URL || 'amqp://username:password@localhost:5672'
    )
    console.info(`Connected to RabbitMQ: ${process.env.RABBITMQ_URL}`)

    this.setConsumers(connection)
    
    return connection
  }

  private static async setConsumers(connection : Connection) {
    const channel: Channel = await connection.createChannel()
    new Queue('queue1', channel).subscribe(printMessage)
  }

  async produce(message: object) {
    const channel: Channel = await this.connection.createChannel()
    await new Queue('queue1', channel).publish(message)
  }
}

class Queue {
  private name: string
  private channel: Channel

  constructor(name: string, channel: Channel) {
    this.name = name
    this.channel = channel
  }

  async subscribe(handler: (msg: ConsumeMessage | null) => void) {
    await this.channel.assertQueue(this.name)
    this.channel.consume(this.name, (message) => {
      handler(message)
      this.channel.ack(message as ConsumeMessage)
    })
  }

  async publish(message: object) {
    await this.channel.assertQueue(this.name)                                 //  Makes the queue available to the client
    this.channel.sendToQueue('queue1', Buffer.from(JSON.stringify(message)))  //  Send a message to the queue
  }
}