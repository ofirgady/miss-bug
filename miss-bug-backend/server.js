import fs from 'fs'
import express from 'express'
import cors from 'cors'
import { loggerService } from './services/logger.service.js'
import { bugService } from './api/bug/bug.service.js'
import PDFDocument from 'pdfkit'
import { bugRoutes } from './api/bug/bug.routes.js'
import cookieParser from 'cookie-parser'
import { userRoutes } from './api/user/user.routes.js'

const corsOptions = {
	origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
	credentials: true,
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => res.send('Hello there'))

app.use('/api/bug', bugRoutes);
app.use('/api/user', userRoutes);



app.listen(3030, () => {
	loggerService.info(`Example app listening on port 3030`)
})
