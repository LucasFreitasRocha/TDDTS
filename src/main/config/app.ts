import express from 'express'
import setUpMidlewates from './middlewares'
import setUpRoutes from './routes'
const app = express()
setUpMidlewates(app)
setUpRoutes(app)
export default app
