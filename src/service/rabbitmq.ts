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
    const queue = 'queue1'
    await channel.assertQueue(queue)
    channel.consume(queue, (message) => {
      printMessage(message)
      channel.ack(message as ConsumeMessage)
    })       
  }

  async produce(message: string) {
    const channel: Channel = await this.connection.createChannel()
    await channel.assertQueue('queue1')                  //  Makes the queue available to the client
    channel.sendToQueue('queue1', Buffer.from(message))  //  Send a message to the queue
  }
}