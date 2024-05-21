
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import {redisClient} from '../redis/index'
import dayjs = require('dayjs')

const WORK_SET='workSet'
const WORD_LIST='workList'
export interface WorkItem {
    id: number,
    title:string
    from:string,
    link:string,
    date:string
}
export async function getWorkList(){
    let list:any=await redisClient.lRange(WORD_LIST,0,-1)
    list=list.map((item:string)=>JSON.parse(item) as WorkItem )
    return list
}
/**
 * 获取前端发送数据
 * url: name=ming 🏀🏀🏀 ctx.query
 * url:/user/ming 🏀🏀🏀 ctx.params
 * header: ctx.request.header
 * body:  ctx.request.body  ctx.request.files
 */

// 查询
router.get('/', async (ctx) => {
    const list=await getWorkList()
    list.sort((a:WorkItem,b:WorkItem)=>dayjs(a.date).isBefore(dayjs(b.date))?1:-1)
    ctx.body = getRes<WorkItem[]>(2000, list)
})


export default router.routes()
        
