import * as Router from 'koa-router'

import ProjectRouter from './projectRouter'
import InfoRouter from './infoRouter'
import utilRouter from './utilRouter'
import watchRouter from './watch'
import userRouter from './user'
const apiRouter = new Router()
apiRouter.use('/project', ProjectRouter)
apiRouter.use('/info', InfoRouter)
apiRouter.use('/util', utilRouter)
apiRouter.use('/watch', watchRouter)
apiRouter.use('/user', userRouter)
export default apiRouter.routes()
