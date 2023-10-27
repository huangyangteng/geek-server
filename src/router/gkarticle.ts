
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface GkarticleItem {
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
    let res = await query<GkarticleItem[]>('SELECT aid from `gkarticle`', [])
    ctx.body = getRes<GkarticleItem[]>(2000, res)
})
router.get('/detail', async (ctx) => {
    const {id}=ctx.query
    let res = await query<GkarticleItem[]>('SELECT * from `gkarticle` where id = ?', [id])
    ctx.body = getRes<GkarticleItem>(2000, res[0])
})


router.get('/:aid', async (ctx) => {
    let res = await query<GkarticleItem[]>('SELECT * from `gkarticle` where aid = ?', [ctx.params.aid])
    ctx.body = getRes<GkarticleItem>(2000, res[0])
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...ctx.request.body,
    }
    const res=await query<OkPacket>('INSERT INTO `gkarticle` SET?', req)
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
    const res = await query<GkarticleItem[]>('SELECT * from `gkarticle` WHERE `id`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE gkarticle SET name=?,name2=? WHERE id=?', [
        req.name,
        req.name2,
        String(id),
    ])
    ctx.body=getRes<GkarticleItem>(2000,req)
})
//批量删除
router.post('/del',async ctx=>{
    let {ids}=ctx.request.body
    console.log('🐥🐥🐥',ids)
    if(!ids){
        ctx.body=getRes<string>(5001,'参数不完整')
        return
    }
    await query<OkPacket>('DELETE FROM `gkarticle` WHERE aid IN (?)',[ids])
    ctx.body=getRes<string>(2000,'删除成功')
})
export default router.routes()
        
