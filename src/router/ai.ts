import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import axios from 'axios';
const OpenAI = require("openai");
const kimiClient = new OpenAI({
    apiKey: process.env.KIMI_API_KEY as string,
    baseURL: "https://api.moonshot.cn/v1",
});
 
interface ReqItem{
    role:string
    content:string
}
interface OpenAiReqType{
    model:string
    messages:ReqItem[]
}
const openAiKey=process.env['OPENAI_API_KEY']
router.post('/openai', async (ctx) => {
    const res=await axios.request({
        url:'https://gateway.ai.cloudflare.com/v1/f92b90a2d47b7aee0339aba7f21c8019/openai-gateway/openai/chat/completions',
        method:'post',
        headers:{
            Authorization:`Bearer ${openAiKey}`
        },
        data:ctx.request.body as OpenAiReqType
    })
    ctx.body=getRes(2000,res.data)
})

router.post('/kimi',async ctx=>{
    const completion = await kimiClient.chat.completions.create(
        ctx.request.body
    );
    ctx.body=getRes(2000,completion)
})

export default router.routes()
