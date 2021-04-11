import * as Router from 'koa-router'
import { getRes, walkDir, getExt, uuid } from '../tools/index'
const router = new Router()
import * as fs from 'fs'
import * as send from 'koa-send'
//@ts-ignore
import { handleTaobaoData } from '../tools/taobao/handleTaobaoData.js'
function getName(path: string) {
    return path.split('/').pop()
}
interface VideoItem {
    id: string
    name: string
    src: string
}
interface WatchRes {
    title: string
    list: VideoItem[]
}
interface ListItem{
    id:string
    name:string
    age:number
}

router.all('/test', async (ctx) => {
    console.log(ctx.request.files)
    ctx.body = getRes<any>(2000, {
        method: ctx.request.method,
        url: ctx.request.url,
        header: ctx.request.header,
        params: ctx.query,
        // params:ctx.params
        body: ctx.request.body,
        files: ctx.request.files,
    })
})

//https://www.npmjs.com/package/koa-send
router.all('/taobao', async (ctx) => {
    const {  startTime, endTime, rate } = ctx.request.body
    const type=rate==0?'中评':'差评'
    const fileName=`${startTime}-${endTime}${type}.xlsx`
    // 生成文件
    const success = await handleTaobaoData(ctx.request.body,fileName)
    console.log("success", success)
    ctx.body='ok'
    if (success) {
        const path = 'excels/'+fileName
        ctx.attachment(path)
        await send(ctx, path)
    }else{
        ctx.body='error'
    }
})

router.post('/watch', async (ctx) => {
    const { path } = ctx.request.body
    if (!fs.existsSync(path)) {
        ctx.body = getRes<string>(3000, '路径不存在')
        return
    }
    const list = walkDir(path)
    const videoList: VideoItem[] = list
        .filter((item) => getExt(item) == 'mp4')
        .map((item) => {
            return {
                id: uuid(),
                name: getName(item),
                src: item,
            }
        })

    ctx.body = getRes<WatchRes>(2000, {
        title: getName(path),
        list: videoList,
    })
})

router.get('/list',async (ctx)=>{
    const {id}=ctx.request.query
    let list=[{id:0,name:'xiaoming',age:11},{id:1,name:'xiaohong',age:23},{id:2,name:'Jack',age:11},{id:3,name:'Peter',age:23},{id:3,name:'Mouse',age:23}]
    if(id && id!=-1){
        list=list.filter(item=>item.id==id)
    }
    ctx.body=list
})

export default router.routes()
