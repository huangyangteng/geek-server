
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface ArticleItem {
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
    const {id}=ctx.query
    let res = await query<ArticleItem[]>('SELECT * from `article` where id=?   ', [id])
    ctx.body = getRes<ArticleItem[]>(2000, res)
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...ctx.request.body,
    }
    const res=await query<OkPacket>('INSERT INTO `article` SET?', req)
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
    const res = await query<ArticleItem[]>('SELECT * from `article` WHERE `id`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE article SET encontent=?,mixcontent=?,chcontent=? WHERE id=?', [
        req.encontent,
        req.mixcontent,
        req.chcontent,
        String(id),
    ])
    ctx.body=getRes<ArticleItem>(2000,req)
})

export default router.routes()
        
