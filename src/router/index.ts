import * as Router from 'koa-router'

import ProjectRouter from './projectRouter'
import InfoRouter from './infoRouter'
import utilRouter from './utilRouter'
const apiRouter = new Router()
apiRouter.use('/project', ProjectRouter)
apiRouter.use('/info', InfoRouter)
apiRouter.use('/util', utilRouter)
export default apiRouter.routes()
