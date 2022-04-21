import { Request, Response } from 'express';
import { readFileSync } from 'fs';

export function ping(_req: Request, res: Response) {
  res.status(200).send({ ping: 'pong' })
}

export function version(_req: Request, res: Response) {
  const pkg: { version: string } = JSON.parse(readFileSync(__dirname + '/../../package.json', 'utf-8'))
  return res.send({ version: pkg.version })
}