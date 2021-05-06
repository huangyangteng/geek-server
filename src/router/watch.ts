import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import { getRes, readFileAndParse } from '../tools/index'
import { generateResource } from '../tools/watch';
import { WatchItemContent, WatchChildItem } from '../types/watchType';

const PROJECT_PATH = path.join(__dirname, '../data/watch.json')

const DEFAULT_DIR='/Users/h/Desktop/learnvideo'
// 生成数据
router.all('/run',async ctx=>{
    let {dir}=ctx.request.body
    if(!dir){
        dir=DEFAULT_DIR
    }
    try {
        generateResource(dir,PROJECT_PATH)
        ctx.body=getRes<string>(2000,'success')
        
    } catch (error) {
        ctx.body = getRes<string>(5000, '生成失败'+error)
    }
})



router.get('/', async ctx => {
    const data = readFileAndParse(PROJECT_PATH)
    ctx.body = getRes<WatchItemContent[]>(2000, data)
})
router.get('/query', async ctx => {
    const {courseId}=ctx.query
    console.log("courseId", courseId)
    const data:WatchItemContent[] = readFileAndParse(PROJECT_PATH)
    if(courseId){
        let allCourse=data.map(item=>item.list).reduce((prev,cur)=>prev.concat(cur),[])
        let item= allCourse.find(item=>item.id==courseId)
        console.log("item", item)
        if(item){
            ctx.body = getRes<WatchChildItem>(2000, item)
        }else{
            ctx.body=getRes<string>(5000,'未找到该课程id')
        }
    }else{
        ctx.body=getRes<string>(5000,'请输入正确的查询参数')

    }

  

  
})




export default router.routes()
