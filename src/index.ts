import express from "express";
import { defaultRouter } from "./routes";
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { RabbitMQ } from "./service/rabbitmq";
dotenvExpand.expand(dotenv.config()) 

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', defaultRouter())

app.get('/', (_req, res) => {
  res.send('Hello Node Server')
})

RabbitMQ.init()

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))