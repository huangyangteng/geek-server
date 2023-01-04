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
    getHDLink,
    getAddParams,
    getSid,
    getBBUserId,
    getCidByBid,
    getBBVideoPage
} from '../tools/blibli'
import {
    getRes,
    readFileAndParse,
    walkDir,
    getExt,
  
} from '../tools/index'
import { generateResource, getOutput, getCodec } from '../tools/watch'
import {
    WatchItemContent,
    WatchChildItem,
    WatchBBItem,
} from '../types/watchType'
import { OkPacket } from '../types/index'
import { getAcVideoInfo } from '../tools/acfun'
import { getVideoCollection } from '../tools/blibli';

const PROJECT_PATH = path.join(__dirname, '../data/watch.json')

const DEFAULT_DIR = '/Users/h/Desktop/learnvideo'

// 解析blibli的视频
router.all('/bb', async (ctx) => {
    const link=ctx.request.body.link
    //----------------------- 处理合集逻辑
    const sid=getSid(link)
    if(sid){//合集
        let userId=getBBUserId(link)
        const collectionRes=await getVideoCollection(sid,userId)
        if(collectionRes.code==0){
            let {meta,archives}=collectionRes.data.data
            ctx.body = getRes(2000, {
                isCollection:true,
                title:meta.name,
                pages:archives
                
            })
        }
        return 
    }
    // --------单个视频的逻辑
    const bid = getBBVideoId(ctx.request.body.link)
    const page=getBBVideoPage(ctx.request.body.link)
   
    // const aid=ctx.request.body.aid
    const onlySrc = ctx.request.body.onlySrc
    // 只返回视频播放的src
    // const videoSrc = await getBBVideoSrc(ctx.request.body.link)
    let videoInfoRes: any
    let responseBody = {
        bid: bid,
        // src: videoSrc,
    }
    // 如果需要返回视频列表等信息，返回视频列表
    if (!onlySrc) {
        videoInfoRes = await getBBVideoInfo(bid)
        const res = await getHDLink(bid, videoInfoRes.data.data.cid,page)
        responseBody = Object.assign(responseBody, {
            ...videoInfoRes.data.data,
            ...res,
        })
    }
    ctx.body = getRes(2000, responseBody)
})

router.all('/bb-parse', async (ctx) => {
    let bid=ctx.request.body.bid
    let cid=ctx.request.body.cid
    let page=ctx.request.body.p
    let isCollection=ctx.request.body.collection
    // 处理合集的解析
    if(isCollection){
        bid=ctx.request.body.cid
        cid=await getCidByBid(bid)
    }
    const res = await getHDLink(bid, cid,page)
    ctx.body = getRes(2000, res)
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


// 添加
router.post('/add', async (ctx) => {
    let { link, type, from = 'bb', type2 = '' } = ctx.request.body
    let req
    if (from === 'bb') {
        req=await getAddParams( ctx.request.body)
        console.log(req)
        debugger

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
            type2,
        }
    }
    const insertInfo = await query<OkPacket>('INSERT INTO `bb-video` SET?', req)
    ctx.body = getRes<number>(2000, insertInfo.insertId)
})
// 删除
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
// 修改
router.put('/update', async (ctx) => {
    let { ids } = ctx.request.body
    console.log('🙂',ids)
    let  req:WatchItemContent={
        ...ctx.request.body
    }
    for(let i=0;i<ids.length;i++){
        let id=ids[i]
        const res = await query<WatchItemContent[]>(
            'SELECT * from `bb-video` WHERE `id` = ?',
            [id]
        )
        if(!res[0]){
            ctx.body = getRes<string>(5000, '未找到对应的视频')
            return 
        }
        let reqData=Object.assign({},res[0],req)
        await query<OkPacket>('UPDATE `bb-video` SET type=?,type2=? WHERE id=?',[reqData.type,reqData.type2,reqData.id])
    }
   

    ctx.body = getRes<number>(2000, ids)
})
export default router.routes()
