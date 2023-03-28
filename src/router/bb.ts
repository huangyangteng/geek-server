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
const COOKIE=`LIVE_BUVID=AUTO5716251022063532; i-wanna-go-back=-1; buvid4=3AA193EA-524C-3694-1574-C90B1D1BC55D44557-022012417-5fyojWqsNF8CuUz2JJRNLg%3D%3D; CURRENT_BLACKGAP=0; buvid_fp_plain=undefined; is-2022-channel=1; fingerprint3=e8b721502d727571d89fa2f5e00ae94b; blackside_state=0; buvid3=AD636381-A951-4D6F-BCD9-70814383945E167610infoc; hit-dyn-v2=1; b_nut=100; _uuid=57C964CE-EF93-A2FF-510103-C81EB8C77C4890314infoc; DedeUserID=33442297; DedeUserID__ckMd5=a2e4379307338932; CURRENT_QUALITY=112; rpdid=0zbfAHZkTj|6k1iWEHO|3C6|3w1OViFo; PVID=1; fingerprint=41b7b2a087ecc779abbb5f5e15a6582f; buvid_fp=41b7b2a087ecc779abbb5f5e15a6582f; nostalgia_conf=-1; header_theme_version=CLOSE; home_feed_column=5; hit-new-style-dyn=0; CURRENT_FNVAL=4048; b_lsid=79F2A6BA_187042A3A09; SESSDATA=a567e083%2C1694954093%2C6bb4c%2A32; bili_jct=e0f79bdb9783ea90580447d42fa26e4d; sid=6iprl6ou; bp_video_offset_33442297=775513730558460000`

// 转发请求
// 获取某个up主的动态
router.get('/dynamic', async (ctx) => {
    const {host_mid,page}=ctx.query
    const url1=`
    curl 'https://api.bilibili.com/x/space/wbi/arc/search?mid=${host_mid}&pn=1&ps=25&index=1&order=pubdate&order_avoided=true&platform=web&web_location=1550101&w_rid=e96547f21184930e1a675dedc2d9a504&wts=1679909374' \
  -H 'authority: api.bilibili.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: zh-CN,zh;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'cookie: buvid3=BD08E5F6-FCCC-026C-E40E-5C24E6E58E7959783infoc; b_nut=1679909359; b_lsid=B668853B_187226693FF; _uuid=93636510F-6211-B3AF-6F36-A10BCBED71F5F60653infoc; buvid4=A7128767-F3CD-DCC3-007E-BE5DA05985C560967-023032717-5fyojWqsNF8CuUz2JJRNLg%3D%3D; buvid_fp=4a0fe051d1b1b30df5f8a25952b61637' \
  -H 'origin: https://space.bilibili.com' \
  -H 'pragma: no-cache' \
  -H 'referer: https://space.bilibili.com/${host_mid}?spm_id_from=333.337.0.0' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  --compressed
    `
    const url = `
    curl 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?host_mid=${host_mid}&offset=&page=${page}&features=itemOpusStyle' \
  -H 'authority: api.bilibili.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
  -H 'cache-control: no-cache' \
  -H 'cookie:${COOKIE}' \
  -H 'origin: https://t.bilibili.com' \
  -H 'pragma: no-cache' \
  -H 'referer: https://t.bilibili.com/?spm_id_from=333.788.0.0' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  --compressed
    `
    const res=await request(url1)
    if(res.data.code===0){
        ctx.body = getRes<any>(2000, res.data.data)
    }else{
        ctx.body = getRes<any>(5000, res.data)
    }
    console.log(res)
   
})

export default router.routes()
