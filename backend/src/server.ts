/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { mintAndTransfer } from './providers/Web3Provider'

const PORT: number = parseInt(`${process.env.PORT || 3001}`)

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN }))

app.use(helmet())

app.use(morgan('tiny'))

app.post(
  '/mint/:wallet',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tx = await mintAndTransfer(req.params.wallet)
      res.json(tx)
    } catch (error) {
      res.status(500).json(error)
    }
  },
)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
