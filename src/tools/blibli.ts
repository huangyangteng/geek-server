import { isNumeric, request } from '.'
import query from '../db/mysql'
import { UserItem } from '../types/userTypes'
import { getParams } from './index';

const Cookie=`session=eyJjc3JmX3Rva2VuIjoiYzc1NDA4ZjYzMjRlYjRlODhhODg2NmViNWFjMDRkZTVlNDFkNjZkNiJ9.YwMg4A.yQMeQMiK8E74Zfg1GH_dRoPu670; Hm_lvt_495c417f527bcffa6cfe018d92be1e98=1658674190,1659246492,1659443453,1661149409; Hm_lpvt_495c417f527bcffa6cfe018d92be1e98=1661149414`

export const handleBBShortLink = async (link: string) => {
    // 请求
    const linkRes = await request(`curl ${link}`)
    console.log('linkRes', linkRes)
    const reg = /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
    let videoLink = linkRes.data.match(reg)[0]
    videoLink = videoLink.split('?')[0]
    return videoLink
}
export function getBBVideoId(link: string) {
    link = link.split('?')[0]
    let tmp = link.split('/')
    let bid = tmp.pop()
    if (bid) {
        return bid
    } else {
        return tmp.pop()
    }
}
/**
 * 从响应中截取视频url
 * @param str
 * @returns
 */
export function getVideoUrlByRes(str: string) {
    const res = str.match(
        /readyVideoUrl:\s*\'((https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]))/
    )
    return res[1]
}
export const getBBVideoSrc = async (link: string) => {
    const api = `
    curl ${link} -L -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'  --compressed
    `
    const res = await request(api)
    return getVideoUrlByRes(res.data)
}

export const getBBUserCookie = async () => {
    const res = await query<UserItem[]>(
        'SELECT * from `bb-user` WHERE `username` = ?',
        ['huangyangteng']
    )
    return res[0].cookie
}
export const getBBVideoInfo = async (bid: string) => {
    // const cookie=await getBBUserCookie()
    const api = `
    curl 'https://api.bilibili.com/x/web-interface/view?bvid=${bid}' \
  -H 'authority: api.bilibili.com' \
  -H 'pragma: no-cache' \
  -H 'cache-control: no-cache' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"' \
  -H 'accept: */*' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'origin: https://www.bilibili.com' \
  -H 'sec-fetch-site: same-site' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://www.bilibili.com/video/BV1kK4y1M7zy/?spm_id_from=333.788.recommend_more_video.-1' \
  -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
  --compressed
    `
    return request(api)
}
export const getCidByBid=async(bid:string)=>{
    let res=await getBBVideoInfo(bid)
    return res.data.data.cid
}

export function getAv(x: string) {
    let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'
    let tr: Record<string, number> = {}
    for (let i = 0; i < 58; i++) {
        tr[table[i]] = i
    }

    let s = [11, 10, 3, 8, 4, 6]
    let xor = 177451812
    let add = 8728348608
    //bv ->av
    let r = 0
    for (let i = 0; i < 6; i++) {
        r += tr[x[s[i]]] * 58 ** i
    }
    return (r - add) ^ xor
}
export const getCsrfToken = async () => {
    const api = `
    curl 'https://bilibili.syyhc.com/' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: ${Cookie}' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: none' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --compressed
    `
    const res = await request(api)

    const reg =
        /<input\s*id="csrf_token"\sname="csrf_token"\s*type="hidden"\s*value="([a-zA-Z._\-0-9]+)">/g
    try {
        return reg.exec(res.data)[1]
    } catch (error) {
        console.log('error', res.data)
    }
}
// 获取高清视频
export const getHDLink = async (bid: string, cid: string) => {
    const aid = getAv(bid)
    const csrfToken = await getCsrfToken()
    const api = `
    curl 'https://bilibili.syyhc.com/v/play_url' \
    -H 'Accept: application/json, text/javascript, */*; q=0.01' \
    -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'Cache-Control: no-cache' \
    -H 'Connection: keep-alive' \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
    -H 'Cookie: ${Cookie}' \
    -H 'Origin: https://bilibili.syyhc.com' \
    -H 'Pragma: no-cache' \
    -H 'Referer: https://bilibili.syyhc.com/parser' \
    -H 'Sec-Fetch-Dest: empty' \
    -H 'Sec-Fetch-Mode: cors' \
    -H 'Sec-Fetch-Site: same-origin' \
    -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36' \
    -H 'X-CSRFToken: ${csrfToken}' \
    -H 'X-Requested-With: XMLHttpRequest' \
    -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    --data 'aid=${aid}&cid=${cid}' \
    --compressed
    `
    const res = await request(api)
    console.log(res.data)
    return {
        src: res.data.durl[0].url,
        aid: aid,
        cid: cid,
        bid: bid,
    }
}
// export const getHDLink2 = async (bid: string, cid: string) => {
//     const aid = getAv(bid)
//     console.log(aid, cid)
//     const csrfToken1 = await getCsrfToken()
//     console.log(csrfToken1)
//     const csrfToken = csrfToken1
//     const url = 'https://www.bilibili.com/video/BV1ma4y1L7NE?p=2'
//     const api = `
//     curl 'https://bilibili.syyhc.com/parser' \
//     -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
//     -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
//     -H 'Cache-Control: no-cache' \
//     -H 'Connection: keep-alive' \
//     -H 'Content-Type: application/x-www-form-urlencoded' \
//     -H 'Cookie: session=eyJjc3JmX3Rva2VuIjoiZGQ5Yzg3MzUwNjJkMDVkOGFjNzY2MWMxZTFlMDM5NzlhYjRiYTAzYyJ9.Yob66w.NTdYG8pRSYUaGTQPeZIPWZh9lKc; Hm_lvt_495c417f527bcffa6cfe018d92be1e98=1653013228; Hm_lpvt_495c417f527bcffa6cfe018d92be1e98=1653013538' \
//     -H 'Origin: https://bilibili.syyhc.com' \
//     -H 'Pragma: no-cache' \
//     -H 'Referer: https://bilibili.syyhc.com/' \
//     -H 'Sec-Fetch-Dest: document' \
//     -H 'Sec-Fetch-Mode: navigate' \
//     -H 'Sec-Fetch-Site: same-origin' \
//     -H 'Sec-Fetch-User: ?1' \
//     -H 'Upgrade-Insecure-Requests: 1' \
//     -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36' \
//     -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"' \
//     -H 'sec-ch-ua-mobile: ?0' \
//     -H 'sec-ch-ua-platform: "macOS"' \
//     --data-raw 'url=${url}&go=&csrf_token=${csrfToken}' \
//     --compressed

//     `
//     const res = await request(api)

//     const reg =
//         /<source\s*src="(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])"/
//     console.log(res.data)
//     return {
//         src: reg.exec(res.data)[1],
//         aid: aid,
//         cid: cid,
//         bid: bid,
//     }
// }


 export function getSid(link: string) {
    if (!link.includes('sid')) return null
    let obj = getParams(link)
    if (obj.sid) {
        return obj.sid
    } else {
        return null
    }
}
 export function getBBUserId(link:string){
    return link.split('/').find(item=>isNumeric(item))
}
 export const getVideoCollection=async(sid:string,userId:string)=>{
    console.log('sid',sid,'userId',userId)
    const api=`
    curl 'https://api.bilibili.com/x/polymer/space/seasons_archives_list?mid=${userId}&season_id=${sid}&sort_reverse=false&page_num=1&page_size=100' \
    -H 'authority: api.bilibili.com' \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'origin: https://space.bilibili.com' \
    -H 'referer: https://space.bilibili.com/${userId}/channel/collectiondetail?sid=${sid}' \
    -H 'sec-ch-ua: "Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' \
    --compressed
    `
    console.log(api)
    return await request(api)
 }
//获取添加的b站视频的参数
export const  getAddParams=async (req:any)=>{
    let params={}
     //区别 合集的link带参数?sid=6162
     let { link, type, from = 'bb', type2 = '' } =req
     let sid=getSid(link)
     if(!sid){
          if (link.includes('b23.tv')) {
            //短链接
            link = await handleBBShortLink(link)
        }
        const bid = getBBVideoId(link)
        let res = await getBBVideoInfo(bid)
        let { title, pic } = res.data.data
        params = {
            link,
            type,
            bid,
            name: title,
            poster: pic,
            from: 'bb',
            type2,
        }
        return params
     }else{
        // 处理添加合集的逻辑
        let userId=getBBUserId(link)
        let res=await getVideoCollection(sid,userId)
        console.log(res)
        if(res.code==0){
            let {meta}=res.data.data
            return {
                link,
                type,
                bid:sid,
                name: meta.name,
                poster: meta.cover,
                from: 'bb',
                type2,
                sid:sid
            }
        }

        
     }
    
}