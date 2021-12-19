import * as Router from 'koa-router'
import { getRes, sleep } from '../tools/index';
import { getUserArticles, starArticle, viewArticle } from '../tools/juejin/juejin-api';
import query from '../db/mysql';
import { JuejinUserInfo } from '../types/juejin';
const router = new Router()
interface CookieItem{
    id:number
    name:string
    cookie:string
}
//测试接口
router.get('/test',async (ctx)=>{
    ctx.body=getRes(2000,'success')
})

/**
 * 获取文章列表
 */
router.get('/articles',async (ctx)=>{
    const res=await getUserArticles()
    if(res.code===0 && res.data.err_no===0){
        ctx.body=getRes(2000,res.data.data)
    }else{
        ctx.body=getRes(5000,'获取列表失败')
    }
    console.log("res", JSON.stringify(res))
  
})
/**
 * 点赞
 */
router.post('/star',async (ctx)=>{
    // 获取所有的用户信息
    const {id:articleId}=ctx.request.body
    const userList=await query<JuejinUserInfo[]>('SELECT * FROM cookie')
    for(let i=0;i<userList.length;i++){
        // 查看文章
        viewArticle(articleId)
        console.log('view',articleId)
        // 休眠至少2000ms
        // await sleep(Math.random()*5000+2000)
        await sleep(1000)
        // 点赞
       const res= await starArticle(articleId,userList[i])
       console.log(res.data)
    }
    ctx.body=getRes(2000,'ok')

})

export default router.routes()
