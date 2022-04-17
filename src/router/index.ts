import * as Router from 'koa-router'

import history from './history'
import ProjectRouter from './projectRouter'
import InfoRouter from './infoRouter'
import utilRouter from './utilRouter'
import watchRouter from './watch'
import userRouter from './user'
import musicRouter from './music'
import juejinRouter from './juejin'
import NoteRouter from './note'
const apiRouter = new Router()
apiRouter.use('/project', ProjectRouter)
apiRouter.use('/history', history)
apiRouter.use('/info', InfoRouter)
apiRouter.use('/util', utilRouter)
apiRouter.use('/watch', watchRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/music', musicRouter)
apiRouter.use('/juejin', juejinRouter)
apiRouter.use('/note', NoteRouter)
export default apiRouter.routes()
