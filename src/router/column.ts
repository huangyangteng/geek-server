
import * as Router from 'koa-router'
const router = new Router()
import { convertToUnderLine, getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface ColumnItem {
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
    let res = await query<ColumnItem[]>('SELECT title,cid,authorname from `column`', [])
    ctx.body = getRes<ColumnItem[]>(2000, res)
})
router.get('/:cid', async (ctx) => {
    let res = await query<any>('SELECT * from `column` where cid = ?', [ctx.params.cid])
    ctx.body = getRes<any>(2000, res[0])
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...convertToUnderLine(ctx.request.body),
    }
    const res=await query<OkPacket>('INSERT INTO `column` SET?', req)
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
    const res = await query<ColumnItem[]>('SELECT * from `column` WHERE `id`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE column SET name=?,name2=? WHERE id=?', [
        req.name,
        req.name2,
        String(id),
    ])
    ctx.body=getRes<ColumnItem>(2000,req)
})

export default router.routes()
        
