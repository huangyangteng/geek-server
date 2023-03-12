import * as Router from 'koa-router'
import { getRes, walkDir, getExt, uuid, writeFile, readFileAndParse } from '../tools/index';
const router = new Router()
import * as fs from 'fs'
import * as send from 'koa-send'
import * as path from 'path'

//@ts-ignore
import { handleTaobaoData } from '../tools/taobao/handleTaobaoData.js'
import dayjs = require('dayjs');
import { createTextChangeRange, createTextSpan } from 'typescript';
import { fetchDict, parseDict } from '../tools/haici';
import { getFundInfo } from '../tools/invest';
import { getBBVideoSrc } from '../tools/blibli';
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
interface File{
    id:string
    name:string
    path:string
    date:string
}
router.get("/bdy(.*)",async (ctx)=>{
    ctx.body=JSON.stringify({code:'ok'})
})

router.get('/invest',async(ctx)=>{
    const res=await getFundInfo()
    ctx.body=getRes<any>(2000,res)
})

// 上传
const FILES_PATH = path.join(__dirname, '../data/files.json')
router.post('/upload',async (ctx)=>{
    const {path,name}=ctx.request.files.file
    const filePath='gk-files'+'/'+path.split('/').pop()
    const files:File[]=readFileAndParse(FILES_PATH)
    writeFile<File[]>(FILES_PATH,[{id:uuid(),name,path:filePath,date:dayjs().format('YYYY-MM-DD HH:mm:ss')},...files])
    ctx.body=getRes<any>(2000,{data:'ok'})
})
// 获取上传的文件列表
router.get('/files',async (ctx)=>{
    let files:File[]=readFileAndParse(FILES_PATH)
    let {start,end}=ctx.query
    // start 与end之间
    if(start && end){
        start=dayjs(start).subtract(1,'ms')
        end=dayjs(end).add(1, 'ms')
        files=files.filter(item=>{
           return dayjs(item.date).isAfter(start) && dayjs(item.date).isBefore(end)
        })
    }
    ctx.body=getRes<any>(2000,files)
})



// 测试接口
router.all('/test', async (ctx) => {
    console.log(ctx.request.files)
    ctx.body = getRes<any>(2000, {
        method: ctx.request.method,
        url: ctx.request.url,
        header: ctx.request.header,
        params: ctx.query,//name=xxx&age=xxx
        // params:ctx.params
        body: ctx.request.body,
        files: ctx.request.files,
    })
})

//https://www.npmjs.com/package/koa-send
router.all('/taobao', async (ctx) => {
    const {  startTime, endTime, rate } = ctx.request.body
    const type=rate==0?'中评':'差评'
    
    const fileName=`${startTime}-${endTime}${type}_${uuid()}.xlsx`
    // 生成文件
    const success = await handleTaobaoData(ctx.request.body,fileName)
    console.log("success", success)
    ctx.body='ok'
    if (success) {
      ctx.body=getRes<any>(2000,{
          file:fileName
      })
    }else{
        ctx.body=getRes<string>(5000,'生成excel失败')
    }
})
router.get('/download',async(ctx)=>{
    const fileName=ctx.query.file
    const path = 'excels/'+fileName
    ctx.attachment(path)
    await send(ctx, path)
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


router.get('/see',async (ctx)=>{
    const {key}=ctx.request.query
    console.log(key)
    ctx.body=getRes<string>(2000,key)
})

// 解析海词词典
router.get('/translate',async (ctx)=>{
    const {word}=ctx.request.query
    console.log(word)
    const doc=await fetchDict(word)
    const res=parseDict(doc)
    ctx.body=getRes<any>(2000,res)
})
router.get('/bb-test',async ctx=>{
    const src=await getBBVideoSrc(ctx.request.query.link)
    console.log('🍎🍎🍎🍎',src)
    ctx.body=getRes(200,src)
})
export default router.routes()
