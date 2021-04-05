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
    const { cookie, startTime, endTime, rate } = ctx.request.body
    console.log(
        'cookie,startTime,endTime,rate',
        cookie,
        startTime,
        endTime,
        rate
    )
    // 生成文件
    const success = await handleTaobaoData()
    console.log("success", success)
    if (success) {
        const path = '3.29-4.04.xlsx'
        ctx.attachment(path)
        await send(ctx, path)
    }else{
        ctx.body='error'
    }
    // ctx.body = 'ok'
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

export default router.routes()
