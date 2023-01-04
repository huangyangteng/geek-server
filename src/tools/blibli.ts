import { isNumeric, request } from '.'
import query from '../db/mysql'
import { UserItem } from '../types/userTypes'
import { getParams } from './index';
import axios from 'axios';
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
export function getBBVideoPage(link: string) {
    if (!link.includes('p=')) return 1
    let obj = getParams(link)
    if (obj.p) {
        return obj.p
    } else {
        return 1
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

const getVideoUrl=async(aid:number,p:number=1)=>{
    const res=await axios.get(`https://api.injahow.cn/bparse/?av=${aid}&p=${p}&format=mp4&otype=json`)
    console.log('res',res.data.url)
    return res.data?.url
}
// 获取高清视频
export const getHDLink = async (bid: string, cid: string,p?:number) => {
    const aid = getAv(bid)

    const url = await getVideoUrl(aid,p)
    // console.log('----------',res)
    return {
        src: url,
        aid: aid,
        cid: cid,
        bid: bid,
    }
}


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