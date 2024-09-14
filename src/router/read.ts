import * as Router from 'koa-router'
import { getRes, sleep } from '../tools/index';
import { getUserArticles, starArticle, viewArticle, signIn } from '../tools/juejin/juejin-api';
import query from '../db/mysql';
import { JuejinUserInfo } from '../types/juejin';
import { OkPacket } from '../types/index';
import { handleInfoLink, getTitleFromLink } from '../tools/note';
const schedule = require('node-schedule');
const router = new Router()
interface ReadItem{
    id:number
    name:string
    link:string
}
//测试接口
router.get('/test',async (ctx)=>{

    ctx.body=getRes(2000,'success')
})
router.get('/',async ctx=>{
    let res=await query<ReadItem[]>('SELECT * from `read`',[])
    ctx.body = getRes<ReadItem[]>(2000, res.reverse())
})
// 增加
router.post('/',async ctx=>{
    const req=Object.assign({
        tag:'',
        timeline:'[]',
        type:1,
        push:0,

    },ctx.request.body)
    await query<OkPacket>('INSERT INTO `read` SET?',req)
    ctx.body=getRes(2000,'success')
})
router.put('/',async ctx=>{
    let {id}=ctx.request.body
    if(!id){
        ctx.body=getRes(5000,'请传递要修改的id')
        return
    }
    const res = await query<ReadItem[]>(
        'SELECT * from `read` WHERE `id`=? ',
        [id]
    )
   let req={
    ...res[0],
    ...ctx.request.body
   }
    await query<OkPacket>(
        'UPDATE `read` SET push=?,timeline=?,type=?,tag=?,name=? WHERE id=?',
        [
            req.push,
            req.timeline,
            req.type,
            req.tag,
            req.name,
            String(id),
        ]
    )
        ctx.body=getRes(2000,req)
})

router.get('/info',async ctx=>{
    console.log("ctx.query.link", ctx.query.link)
    const data=await getTitleFromLink(ctx.query.link as string)
    ctx.body=getRes(2000,data)
})

export default router.routes()