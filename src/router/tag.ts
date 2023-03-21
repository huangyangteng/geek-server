
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface TagItem {
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
    let res = await query<TagItem[]>('SELECT * from `tag`', [])
    ctx.body = getRes<TagItem[]>(2000, res)
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...ctx.request.body,
    }
    const res=await query<OkPacket>('INSERT INTO `tag` SET?', req)
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
    const res = await query<TagItem[]>('SELECT * from `tag` WHERE `id`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE tag SET name=?,name2=? WHERE id=?', [
        req.name,
        req.name2,
        String(id),
    ])
    ctx.body=getRes<TagItem>(2000,req)
})

export default router.routes()
        
