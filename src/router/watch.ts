import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import { getRes, readFileAndParse } from '../tools/index'
import { generateResource } from '../tools/watch';
import { WatchItemContent } from '../types/watchType';

const PROJECT_PATH = path.join(__dirname, '../data/watch.json')


// 生成数据
router.post('/run',async ctx=>{
    const {dir}=ctx.request.body
    try {
        generateResource(dir)
        ctx.body=getRes<string>(2000,'success')
        
    } catch (error) {
        ctx.body = getRes<string>(5000, '生成失败'+error)
    }
})



router.get('/', async ctx => {
    const data = readFileAndParse(PROJECT_PATH)
    ctx.body = getRes<WatchItemContent[]>(2000, data)
})



export default router.routes()
