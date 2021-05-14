
import { Express, Router } from 'express'
import signRoute from '../routes/signup-routes'
// import fg from 'fast-glob'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  signRoute(router)
}
