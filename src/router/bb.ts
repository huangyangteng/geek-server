import * as Router from 'koa-router'
const router = new Router()
import { getRes,request } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface BbItem {
    id?: number
}
/**
 * 获取前端发送数据
 * url: name=ming 🏀🏀🏀 ctx.query
 * url:/user/ming 🏀🏀🏀 ctx.params
 * header: ctx.request.header
 * body:  ctx.request.body  ctx.request.files
 */
const COOKIE=`LIVE_BUVID=AUTO5716251022063532; i-wanna-go-back=-1; buvid4=3AA193EA-524C-3694-1574-C90B1D1BC55D44557-022012417-5fyojWqsNF8CuUz2JJRNLg%3D%3D; CURRENT_BLACKGAP=0; buvid_fp_plain=undefined; is-2022-channel=1; blackside_state=0; buvid3=AD636381-A951-4D6F-BCD9-70814383945E167610infoc; hit-dyn-v2=1; b_nut=100; _uuid=57C964CE-EF93-A2FF-510103-C81EB8C77C4890314infoc; DedeUserID=33442297; DedeUserID__ckMd5=a2e4379307338932; CURRENT_QUALITY=112; rpdid=0zbfAHZkTj|6k1iWEHO|3C6|3w1OViFo; nostalgia_conf=-1; header_theme_version=CLOSE; home_feed_column=5; b_ut=5; CURRENT_PID=ec0139f0-ceb1-11ed-ab2e-cf5c4915caab; hit-new-style-dyn=1; FEED_LIVE_VERSION=V8; fingerprint=60fb5c6c8591ea794f772210fe44a084; buvid_fp=60fb5c6c8591ea794f772210fe44a084; CURRENT_FNVAL=4048; browser_resolution=1920-1065; PVID=1; b_lsid=3E397910B_188CF05030E; SESSDATA=4070e97b%2C1702652409%2Ccaac2%2A62; bili_jct=8c6fd1f2d9c759013c371fadf7aa66b5; sid=gf5b50b4; bp_video_offset_33442297=808536381000253400`

// 转发请求
// 获取某个up主的动态
router.get('/dynamic', async (ctx) => {
    const {host_mid,page}=ctx.query
    const url= `
    curl 'https://api.bilibili.com/x/space/wbi/arc/search?mid=1363445034&ps=30&tid=0&pn=1&keyword=&order=pubdate&platform=web&web_location=1550101&order_avoided=true&w_rid=508d46096e9b2eb38126af71b2bdaca2&wts=1687101134' \
  -H 'authority: api.bilibili.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
  -H 'cache-control: no-cache' \
  -H 'cookie: LIVE_BUVID=AUTO5716251022063532; i-wanna-go-back=-1; buvid4=3AA193EA-524C-3694-1574-C90B1D1BC55D44557-022012417-5fyojWqsNF8CuUz2JJRNLg%3D%3D; CURRENT_BLACKGAP=0; buvid_fp_plain=undefined; is-2022-channel=1; blackside_state=0; buvid3=AD636381-A951-4D6F-BCD9-70814383945E167610infoc; hit-dyn-v2=1; b_nut=100; _uuid=57C964CE-EF93-A2FF-510103-C81EB8C77C4890314infoc; DedeUserID=33442297; DedeUserID__ckMd5=a2e4379307338932; CURRENT_QUALITY=112; rpdid=0zbfAHZkTj|6k1iWEHO|3C6|3w1OViFo; nostalgia_conf=-1; header_theme_version=CLOSE; home_feed_column=5; b_ut=5; CURRENT_PID=ec0139f0-ceb1-11ed-ab2e-cf5c4915caab; hit-new-style-dyn=1; FEED_LIVE_VERSION=V8; fingerprint=60fb5c6c8591ea794f772210fe44a084; buvid_fp=60fb5c6c8591ea794f772210fe44a084; CURRENT_FNVAL=4048; browser_resolution=1920-1065; PVID=1; b_lsid=3E397910B_188CF05030E; SESSDATA=4070e97b%2C1702652409%2Ccaac2%2A62; bili_jct=8c6fd1f2d9c759013c371fadf7aa66b5; bp_video_offset_33442297=808536381000253400; sid=hgxulrpd' \
  -H 'origin: https://space.bilibili.com' \
  -H 'pragma: no-cache' \
  -H 'referer: https://space.bilibili.com/1363445034/video' \
  -H 'sec-ch-ua: "Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' \
  --compressed`
    const url1=`
    curl 'https://api.bilibili.com/x/space/wbi/arc/search?mid=${host_mid}&pn=1&ps=25&index=1&order=pubdate&order_avoided=true&platform=web&web_location=1550101&w_rid=e96547f21184930e1a675dedc2d9a504&wts=1679909374' \
  -H 'authority: api.bilibili.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: zh-CN,zh;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'cookie: ${COOKIE}' \
  -H 'origin: https://t.bilibili.com' \
  -H 'pragma: no-cache' \
  -H 'referer: https://t.bilibili.com/${host_mid}?spm_id_from=333.337.0.0' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  --compressed
    `
    const res=await request(url)
    if(res.data.code===0){
        ctx.body = getRes<any>(2000, res.data.data)
    }else{
        ctx.body = getRes<any>(5000, res.data)
    }
    console.log(res)
   
})

export default router.routes()
