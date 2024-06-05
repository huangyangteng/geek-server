
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface LinesItem {
    id?: number
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
    const {refer}=ctx.request.query
    let res
    if(refer){
        res = await query<LinesItem[]>('SELECT * from `lines` where `refer`=?', [refer])
    }else{
        res = await query<LinesItem[]>('SELECT * from `lines`', [])
    }
    
    ctx.body = getRes<LinesItem[]>(2000, res)
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...ctx.request.body,
    }
    // 防止重复添加
    const findItem = await query<LinesItem[]>('SELECT * from `lines` WHERE `en`=? ', [
        req.en,
    ])
    console.log(findItem)
    if(findItem.length>0){
        ctx.body = getRes<string>(5000, '已存在')
        return 
    }
    const res=await query<OkPacket>('INSERT INTO `lines` SET?', req)
    ctx.body = getRes<number>(2000, res.insertId)
})

// 修改
router.put('/', async (ctx) => {
    let { id } = ctx.request.body
    if (!id) {
        ctx.body = getRes<string>(5001, '参数不完整')
        return
    }
    // 先查询原始数据
    const res = await query<LinesItem[]>('SELECT * from `lines` WHERE `id`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE `lines` SET time=? WHERE id=?', [
        req.time,
        id,
    ])
    ctx.body=getRes<LinesItem>(2000,req)
})

export default router.routes()
        
