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
import EftRouter from './etf'
import JobRouter from './job'
import ReadRouter from './read'
import BookRouter from './book'
import CatalogRouter from './catalog'
import ArticleRouter from './article'
import TagRouter from './tag'
import BbRouter from './bb'
import MiguRouter from './migu'
import UploadRouter from './upload'
import ColumnRouter from './column'
import GkarticleRouter from './gkarticle'
import ReminderRouter from './reminder'
import WorkRouter from './work'
import TraderRouter from './trader'
const apiRouter = new Router()
apiRouter.use('/gkarticle',GkarticleRouter)
apiRouter.use('/work',WorkRouter)
apiRouter.use('/reminder',ReminderRouter)
apiRouter.use('/column',ColumnRouter)
apiRouter.use('/trader',TraderRouter)
apiRouter.use('/upload',UploadRouter)
apiRouter.use('/project', ProjectRouter)
apiRouter.use('/history', history)
apiRouter.use('/info', InfoRouter)
apiRouter.use('/util', utilRouter)
apiRouter.use('/watch', watchRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/music', musicRouter)
apiRouter.use('/juejin', juejinRouter)
apiRouter.use('/note', NoteRouter)
apiRouter.use('/tag',TagRouter)
apiRouter.use('/etf', EftRouter)
apiRouter.use('/job', JobRouter)
apiRouter.use('/read', ReadRouter)
apiRouter.use('/book',BookRouter)
apiRouter.use('/catalog',CatalogRouter)
apiRouter.use('/article',ArticleRouter)
apiRouter.use('/bb',BbRouter)
apiRouter.use('/migu',MiguRouter)
export default apiRouter.routes()
