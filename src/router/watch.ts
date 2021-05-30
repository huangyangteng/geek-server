import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import  * as shelljs from 'shelljs';
import { getRes, readFileAndParse, walkDir, getExt } from '../tools/index';
import { generateResource, getOutput, getCodec } from '../tools/watch';
import { WatchItemContent, WatchChildItem } from '../types/watchType';

const PROJECT_PATH = path.join(__dirname, '../data/watch.json')

const DEFAULT_DIR='/Users/h/Desktop/learnvideo'

//curl -X POST --data-urlencode "dir=/Users/h/Desktop/learnvideo" http://localhost:9999/watch/run

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
//curl -X POST --data-urlencode "dir=/Users/h/Downloads/bdyDownload/59-Vue开发实战/福利篇" http://localhost:9999/watch/transcode

router.all('/transcode',async ctx=>{

    let {dir}=ctx.request.body
    if(!dir){
        ctx.body = getRes<string>(5000, '请输入路径')
        return 
    }
        const list=walkDir(dir)
        for(let i=0;i<list.length;i++){
            let item=list[i]
            if(getExt(item)=='mp4'){
                let codes=await getCodec(item)
                console.log("codes", codes)
                shelljs.exec(`ffmpeg -i ${item} -c:v libx264 ${getOutput(item)}`,(code,stdout,stderr)=>{
                    if(code==0){
                        console.log('success')
                        shelljs.exec(`rm ${item}`)
                    }
                })

            }
           
        }
        // list.forEach(item=>{
        //     if(getExt(item)=='mp4'){
        //         shelljs.exec(`ffmpeg -i ${item} -c:v libx264 ${getOutput(item)}`)
        //         console.log('------------------------------------------------')
        //     }
        // })
     
        ctx.body=getRes<string>(2000,'success')
        
   
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
