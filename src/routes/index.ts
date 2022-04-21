import { Router } from "express";
import { ping, version } from "../controller";

export function defaultRouter(): Router {
  const route: Router = Router()

  route.get('/ping', ping)
  route.get('/version', version)

  return route
}