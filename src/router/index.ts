import * as Router from 'koa-router'

import readRouter from './read'
import ProjectRouter from './projectRouter'
import InfoRouter from './infoRouter'
import utilRouter from './utilRouter'
import watchRouter from './watch'
import userRouter from './user'
import musicRouter from './music'
const apiRouter = new Router()
apiRouter.use('/project', ProjectRouter)
apiRouter.use('/read', readRouter)
apiRouter.use('/info', InfoRouter)
apiRouter.use('/util', utilRouter)
apiRouter.use('/watch', watchRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/music', musicRouter)
export default apiRouter.routes()
