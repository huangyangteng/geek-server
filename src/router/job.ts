import * as Router from 'koa-router'
import { getRes } from '../tools/index';
import { juejinJob } from '../job/juejin-job';
import { sendEmail } from '../tools/email';
const router = new Router()

router.get('/',async ctx=>{
    sendEmail('hello')
    ctx.body=getRes<string>(2000,'success')
})
router.get('/juejin',async ctx=>{
    await juejinJob()
    ctx.body=getRes<string>(2000,'juejin')
})


export default router.routes()