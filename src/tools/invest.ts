import { request } from './index';
import * as cheerio from 'cheerio'

export const getFundInfo=async ()=>{
    const api=`curl http://fundf10.eastmoney.com/jjjz_516160.html`
    const res=await request(api)
    // 解析HTML
    const $ = cheerio.load(res.data)
    // 净值
    const netValue=$('#fund_gsz').html()
    const name=$('.bs_jz .title a').html()
    console.log('netValue',netValue)
    return {
        name,
        netValue
    }
}