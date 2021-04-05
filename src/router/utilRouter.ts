import * as Router from 'koa-router'
import { getRes, walkDir, getExt, uuid } from '../tools/index'
const router = new Router()
import * as fs from 'fs'
import * as send from 'koa-send'
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

router.all('/test', async ctx => {
    console.log(ctx.request.files)
    ctx.body = getRes<any>(2000, {
        method: ctx.request.method,
        url: ctx.request.url,
        header: ctx.request.header,
        params: ctx.query,
        // params:ctx.params
        body: ctx.request.body,
        files: ctx.request.files
    })
})
const http = require('http'),
    fileSystem = require('fs'),
    path = require('path')

// http.createServer(function(request, response) {
//     var filePath = path.join(__dirname, 'myfile.mp3');
//     var stat = fileSystem.statSync(filePath);

//     response.writeHead(200, {
//         'Content-Type': 'audio/mpeg',
//         'Content-Length': stat.size
//     });

//     var readStream = fileSystem.createReadStream(filePath);
//     // We replaced all the event handlers with a simple call to readStream.pipe()
//     readStream.pipe(response);
// })
// .listen(2000);

//https://www.npmjs.com/package/koa-send
router.post('/excel', async ctx => {
    const path = 'package_server'
    ctx.attachment('package_server')
    await send(ctx, path)
})

router.post('/watch', async ctx => {
    const { path } = ctx.request.body
    if (!fs.existsSync(path)) {
        ctx.body = getRes<string>(3000, '路径不存在')
        return
    }
    const list = walkDir(path)
    const videoList: VideoItem[] = list
        .filter(item => getExt(item) == 'mp4')
        .map(item => {
            return {
                id: uuid(),
                name: getName(item),
                src: item
            }
        })

    ctx.body = getRes<WatchRes>(2000, {
        title: getName(path),
        list: videoList
    })
})

export default router.routes()
