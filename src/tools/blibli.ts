import { request } from "."
import query from "../db/mysql"
import { UserItem } from '../types/userTypes';
export const handleBBShortLink=async(link:string)=>{
    // 请求
    const linkRes=await request(`curl ${link}`)
    console.log('linkRes',linkRes)
    const reg=/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
    let videoLink=linkRes.data.match(reg)[0]
    videoLink=videoLink.split('?')[0]
    return videoLink
}
export function getBBVideoId(link: string) {
    link = link.split('?')[0]
    let tmp=link.split('/')
    let bid=tmp.pop()
    if(bid){
        return bid
    }else{
        return tmp.pop()
    }
}
/**
 * 从响应中截取视频url
 * @param str 
 * @returns 
 */
export function  getVideoUrlByRes(str:string){
        const res=str.match(/readyVideoUrl:\s*\'((https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]))/)
        return res[1]
}
export const getBBVideoSrc=async(link:string)=>{
    const api=`
    curl ${link} -L -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'  --compressed
    `
    const res=await request(api)
    return getVideoUrlByRes(res.data) 
}

export const  getBBUserCookie=async()=>{
    const res = await query<UserItem[]>('SELECT * from `bb-user` WHERE `username` = ?', ['huangyangteng'])
    return res[0].cookie
}
export const getBBVideoInfo=async(bid:string)=>{
    // const cookie=await getBBUserCookie()
    const api=`
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