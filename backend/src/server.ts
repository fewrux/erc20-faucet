import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
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
  res.json(true)
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
