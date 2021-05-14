import express from 'express'
import setUpMidlewates from './middlewares'
const app = express()
setUpMidlewates(app)
export default app
