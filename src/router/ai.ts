import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import axios from 'axios';
interface ReqItem{
    role:string
    content:string
}
interface OpenAiReqType{
    model:string
    messages:ReqItem[]
}
const apiKey=process.env['OPENAI_API_KEY']
router.post('/openai', async (ctx) => {
    const res=await axios.request({
        url:'https://gateway.ai.cloudflare.com/v1/f92b90a2d47b7aee0339aba7f21c8019/openai-gateway/openai/chat/completions',
        method:'post',
        headers:{
            Authorization:`Bearer ${apiKey}`
        },
        data:ctx.request.body
    })
    ctx.body=getRes(2000,res.data)
})

export default router.routes()
