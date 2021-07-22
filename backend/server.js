import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/middleware.js'
import colors from 'colors'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import adyenRoutes from './routes/adyenRoutes.js'
import morgan from 'morgan'

import cors from 'cors'

//ignor self signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const cors = require("cors");
// const axios = require('axios')
// const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
// const os = require("os");
// const app = express();

dotenv.config()
connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// enable CORS
app.use(cors());
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/adyen', adyenRoutes)

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
})

app.get('/api/config/adyen', (req, res) => {
  res.send(process.env.API_KEY, process.env.CLIENT_KEY)
})

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

