import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import query from '../db/mysql'
import {
    getBBVideoId,
    getBBVideoSrc,
    getVideoUrlByRes,
    getBBVideoInfo,
    handleBBShortLink,
} from '../tools/blibli'
import { getRes, readFileAndParse, walkDir, getExt } from '../tools/index'
import { generateResource, getOutput, getCodec } from '../tools/watch'
import {
    WatchItemContent,
    WatchChildItem,
    WatchBBItem,
} from '../types/watchType'
import { OkPacket } from '../types/index'
import { getAcVideoInfo } from '../tools/acfun'

const PROJECT_PATH = path.join(__dirname, '../data/watch.json')

const DEFAULT_DIR = '/Users/h/Desktop/learnvideo'

// 解析blibli的视频
router.all('/bb', async (ctx) => {
    const bid = getBBVideoId(ctx.request.body.link)
    const onlySrc = ctx.request.body.onlySrc
    // 只返回视频播放的src
    const videoSrc = await getBBVideoSrc(ctx.request.body.link)
    let videoInfoRes
    let responseBody = {
        bid: bid,
        src: videoSrc,
    }
    // 如果需要返回视频列表等信息，返回视频列表
    if (!onlySrc) {
        videoInfoRes = await getBBVideoInfo(bid)
        responseBody = Object.assign(responseBody, {
            ...videoInfoRes.data.data,
        })
    }

    // console.log('videoInfo',videoInfo)
    ctx.body = getRes(2000, responseBody)
})
router.post('/acfun', async (ctx) => {
    const res = await getAcVideoInfo(
        ctx.request.body.link,
        ctx.request.body.onlySrc
    )
    ctx.body = getRes(2000, res)
})

//curl -X POST --data-urlencode "dir=/Users/h/Desktop/learnvideo" http://localhost:9999/watch/run
router.all('/run', async (ctx) => {
    let { dir } = ctx.request.body
    if (!dir) {
        dir = DEFAULT_DIR
    }
    try {
        generateResource(dir, PROJECT_PATH)
        ctx.body = getRes<string>(2000, 'success')
    } catch (error) {
        ctx.body = getRes<string>(5000, '生成失败' + error)
    }
})

router.get('/', async (ctx) => {
    const data = readFileAndParse(PROJECT_PATH)
    ctx.body = getRes<WatchItemContent[]>(2000, data)
})
router.get('/bb-list', async (ctx) => {
    const res = await query<WatchBBItem[]>('SELECT * from `bb-video`')
    ctx.body = getRes<WatchBBItem[]>(2000, res.reverse())
})

router.get('/query', async (ctx) => {
    const { courseId } = ctx.query
    console.log('courseId', courseId)
    const data: WatchItemContent[] = readFileAndParse(PROJECT_PATH)
    if (courseId) {
        let allCourse = data
            .map((item) => item.list)
            .reduce((prev, cur) => prev.concat(cur), [])
        let item = allCourse.find((item) => item.id == courseId)
        console.log('item', item)
        if (item) {
            ctx.body = getRes<WatchChildItem>(2000, item)
        } else {
            ctx.body = getRes<string>(5000, '未找到该课程id')
        }
    } else {
        ctx.body = getRes<string>(5000, '请输入正确的查询参数')
    }
})

router.post('/add', async (ctx) => {
    let { link, type, from = 'bb' } = ctx.request.body
    let req
    if (from === 'bb') {
        if (link.includes('b23.tv')) {
            //短链接
            link = await handleBBShortLink(link)
        }
        const bid = getBBVideoId(link)
        let res = await getBBVideoInfo(bid)
        let { title, pic } = res.data.data
        req = {
            link,
            type,
            bid,
            name: title,
            poster: pic,
            from: 'bb',
        }
    } else if (from === 'acfun') {
        const { title, pic } = await getAcVideoInfo(
            ctx.request.body.link,
            ctx.request.body.onlySrc
        )
        req = {
            link,
            type,
            bid: getBBVideoId(ctx.request.body.link),
            name: title,
            poster: pic,
            from: 'acfun',
        }
    }
    const insertInfo = await query<OkPacket>('INSERT INTO `bb-video` SET?', req)
    ctx.body = getRes<number>(2000, insertInfo.insertId)
})
router.post('/delete', async (ctx) => {
    const { ids } = ctx.request.body
    if (ids.length === 0) {
        ctx.body = getRes<string>(2000, 'affectedRows:0')
        return
    }
    const deleteInfo = await query<OkPacket>(
        'DELETE FROM `bb-video` WHERE id IN ' + `(${ids.join(',')})`
    )
    ctx.body = getRes<string>(2000, 'affectedRows:' + deleteInfo.affectedRows)
})

export default router.routes()
