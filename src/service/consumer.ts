import { ConsumeMessage } from "amqplib";

export function printMessage(message: ConsumeMessage | null) {
  console.debug(`Message Consumed: ${message?.content.toString()}`)
}