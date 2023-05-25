import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { mintAndTransfer } from './providers/Web3Provider'
dotenv.config()

const PORT: number = parseInt(`${process.env.PORT || 3001}`)

const app = express()

app.use(morgan('tiny'))

interface IPost {
  req: Request
  res: Response
  next: NextFunction
}

app.post('/mint/:wallet', async ({ req, res, next }: IPost) => {
  try {
    const tx = await mintAndTransfer(req.params.wallet)
    res.json(tx)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
