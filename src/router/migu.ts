//
// import * as Router from 'koa-router'
// const router = new Router()
// import { getRes,request } from '../tools/index'
// import query from '../db/mysql'
// import { OkPacket } from '../types/index'
//
// export interface MiguItem {
//     id?: number
// }
// /**
//  * 获取前端发送数据
//  * url: name=ming 🏀🏀🏀 ctx.query
//  * url:/user/ming 🏀🏀🏀 ctx.params
//  * header: ctx.request.header
//  * body:  ctx.request.body  ctx.request.files
//  */
//
// function getVideoInfo(id:string){
//     const url=`
//     curl 'https://c.musicapp.migu.cn/MIGUM3.0/v1.0/content/resourceinfo.do?resourceId=${id}&resourceType=M' \
//   -H 'Accept: application/json, text/plain, */*' \
//   -H 'Accept-Language: zh-CN,zh;q=0.9' \
//   -H 'Cache-Control: no-cache' \
//   -H 'Connection: keep-alive' \
//   -H 'Cookie: mgAppH5CookieId=137277125-0xve2d90fe369b21487d82d860f9b3-1679368693' \
//   -H 'HWID;' \
//   -H 'IMEI: h5page' \
//   -H 'IMSI: h5page' \
//   -H 'OAID;' \
//   -H 'Origin: https://h5.nf.migu.cn' \
//   -H 'Pragma: no-cache' \
//   -H 'Referer: https://h5.nf.migu.cn/' \
//   -H 'Sec-Fetch-Dest: empty' \
//   -H 'Sec-Fetch-Mode: cors' \
//   -H 'Sec-Fetch-Site: same-site' \
//   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
//   -H 'activityId: RBT_ACT_P_SHARE_VRBT_${id}' \
//   -H 'channel: 014000D' \
//   -H 'deviceId: 9C17F500-E736-49CE-BB2F-155BE9B16E16' \
//   -H 'location-data: 30.6698676660,104.1229614820' \
//   -H 'location-info;' \
//   -H 'logId: h5page[76bd]' \
//   -H 'mgm-Network-standard: 03' \
//   -H 'mgm-Network-type: 03' \
//   -H 'mgm-network-operators: 02' \
//   -H 'mgm-user-agent;' \
//   -H 'msisdn;' \
//   -H 'recommendstatus: 1' \
//   -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
//   -H 'sec-ch-ua-mobile: ?0' \
//   -H 'sec-ch-ua-platform: "macOS"' \
//   -H 'subchannel: 014000D' \
//   -H 'test: 00' \
//   -H 'ua: Android_migu' \
//   -H 'uid;' \
//   --compressed
//     `
//     return url
// }
// // 查询
// router.get('/', async (ctx) => {
//
//     const {ids}=ctx.query
//
//     const list=ids.split(',')
//     let resList=[]
//     for(let i=0;i<list.length;i++){
//         let id=list[i]
//         const res=await request(getVideoInfo(id))
//         resList.push(res.data.resource[0])
//     }
//
//     ctx.body=getRes(2000,resList)
//
// })
//
//
// export default router.routes()
//
