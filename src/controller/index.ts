import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { RabbitMQ } from '../service/rabbitmq';

export function ping(_req: Request, res: Response) {
  res.status(200).send({ ping: 'pong' })
}

export function version(_req: Request, res: Response) {
  const pkg: { version: string } = JSON.parse(readFileSync(__dirname + '/../../package.json', 'utf-8'))
  return res.send({ version: pkg.version })
}

export function produce(req: Request, res: Response) {
  const { message } = req.params
  RabbitMQ.get.produce(message)
  res.status(200).send({ message: message })
}