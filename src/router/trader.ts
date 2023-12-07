
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'
import dayjs = require('dayjs')
import { getAllBalance } from '../tools/trader'
export interface TraderItem {
    id: number
    name:string
    key:string
    parterid:string
    status:number
    addTime:string
    balance?:string
    error?:string
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
    let res = await query<TraderItem[]>('SELECT * from `trader`', [])
    ctx.body = getRes<TraderItem[]>(2000, res)
})

router.post('/balance',async ctx=>{
    let res = await query<TraderItem[]>('SELECT * from `trader`', [])
    console.log('🐔🐔🐔',res)
    const data=await getAllBalance(res)
    ctx.body=getRes<TraderItem[]>(200,data)
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...ctx.request.body,
        addTime:dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    const res=await query<OkPacket>('INSERT INTO `trader` SET?', req)
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
    const res = await query<TraderItem[]>('SELECT * from `trader` WHERE `id`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE trader SET name=?,name2=? WHERE id=?', [
        req.name,
        req.name2,
        String(id),
    ])
    ctx.body=getRes<TraderItem>(2000,req)
})

export default router.routes()
        
