import express from "express";
import { defaultRouter } from "./routes";
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', defaultRouter())

app.get('/', (_req, res) => {
  res.send('Hello Node Server')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))