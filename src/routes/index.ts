import { Router } from "express";
import { ping, produce, version } from "../controller";

export function defaultRouter(): Router {
  const route: Router = Router()

  route.get('/ping', ping)
  route.get('/version', version)
  route.get('/produce/:message', produce)

  return route
}