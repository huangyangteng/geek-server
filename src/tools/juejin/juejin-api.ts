import { JuejinUserInfo } from '../../types/juejin';
import { request } from '../index';
import * as fs from 'fs'
import * as path from 'path'
const NEW_COOKIE=fs.readFileSync( path.join(__dirname, '../../data/junjin-cookie')).toString()
// const COOKIE=`_ga=GA1.2.151728167.1605962485; __tea_cookie_tokens_2608=%257B%2522user_unique_id%2522%253A%25227016499237660657191%2522%252C%2522web_id%2522%253A%25227016499237660657191%2522%252C%2522timestamp%2522%253A1641894488265%257D; sid_guard=cfc58a9aedbe8c0cdecbf14f8b1b23bd%7C1653873562%7C31536000%7CTue%2C+30-May-2023+01%3A19%3A22+GMT; uid_tt=b3184cbbc08efac8f69b75212bba3931; uid_tt_ss=b3184cbbc08efac8f69b75212bba3931; sid_tt=cfc58a9aedbe8c0cdecbf14f8b1b23bd; sessionid=cfc58a9aedbe8c0cdecbf14f8b1b23bd; sessionid_ss=cfc58a9aedbe8c0cdecbf14f8b1b23bd; sid_ucp_v1=1.0.0-KDE5YzZmYThlNzQ4NDU3ZDBhZGNmNTdjODQ3MzlkOGI2MDNmY2UyNTUKFwjn6bC__fXlBxCat9CUBhiwFDgCQPEHGgJsZiIgY2ZjNThhOWFlZGJlOGMwY2RlY2JmMTRmOGIxYjIzYmQ; ssid_ucp_v1=1.0.0-KDE5YzZmYThlNzQ4NDU3ZDBhZGNmNTdjODQ3MzlkOGI2MDNmY2UyNTUKFwjn6bC__fXlBxCat9CUBhiwFDgCQPEHGgJsZiIgY2ZjNThhOWFlZGJlOGMwY2RlY2JmMTRmOGIxYjIzYmQ; MONITOR_WEB_ID=8b3685b1-e773-451a-bd33-82f2b9d0e26c; _tea_utm_cache_2608={%22utm_source%22:%22push%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22gengwen202210%22}; _tea_utm_cache_6587={%22utm_source%22:%22jj_nav%22}; _gid=GA1.2.2050379358.1665112779; _tea_utm_cache_4366={%22utm_medium%22:%22feed%22%2C%22utm_campaign%22:%22gengwen202210%22}`
/**
 * 获取用户文章列表
 * @returns 
 */
export function getUserArticles(){
     const api=`
    curl 'https://api.juejin.cn/content_api/v1/article/query_list?aid=2608&uuid=7016499237660657191' \
    -H 'authority: api.juejin.cn' \
    -H 'pragma: no-cache' \
    -H 'cache-control: no-cache' \
    -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'content-type: application/json' \
    -H 'accept: */*' \
    -H 'origin: https://juejin.cn' \
    -H 'sec-fetch-site: same-site' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-dest: empty' \
    -H 'referer: https://juejin.cn/' \
    -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'cookie: _ga=GA1.2.151728167.1605962485; n_mh=QqqO9vdPyoUgGdMUK7bmzGg_3PdkxHeXQjID5mYHilk; MONITOR_WEB_ID=f9b5a304-d583-464d-ac25-bd0fc1849132; passport_csrf_token_default=475afad86e7b82a259c908d9a48072d1; passport_csrf_token=475afad86e7b82a259c908d9a48072d1; passport_auth_status=9853df20faa39109c1ae9beff5bc65ca%2C; passport_auth_status_ss=9853df20faa39109c1ae9beff5bc65ca%2C; sid_guard=25749090957f5566fafdd476795c629b%7C1637734009%7C5184000%7CSun%2C+23-Jan-2022+06%3A06%3A49+GMT; uid_tt=b49d1d72d9a353ed7906d5623567c214; uid_tt_ss=b49d1d72d9a353ed7906d5623567c214; sid_tt=25749090957f5566fafdd476795c629b; sessionid=25749090957f5566fafdd476795c629b; sessionid_ss=25749090957f5566fafdd476795c629b; sid_ucp_v1=1.0.0-KDg3MTQ1NjNkODVjODRiMWU1YWNhMDI0ZTVjOWNhY2IwMThmYWUzYTcKFwjn6bC__fXlBxD5rPeMBhiwFDgCQPEHGgJsZiIgMjU3NDkwOTA5NTdmNTU2NmZhZmRkNDc2Nzk1YzYyOWI; ssid_ucp_v1=1.0.0-KDg3MTQ1NjNkODVjODRiMWU1YWNhMDI0ZTVjOWNhY2IwMThmYWUzYTcKFwjn6bC__fXlBxD5rPeMBhiwFDgCQPEHGgJsZiIgMjU3NDkwOTA5NTdmNTU2NmZhZmRkNDc2Nzk1YzYyOWI; _gid=GA1.2.345609871.1638437496; _tea_utm_cache_2608={%22utm_source%22:%22feed_1%22%2C%22utm_medium%22:%22feed%22%2C%22utm_campaign%22:%22nzzj_yq_2021%22}' \
    --data '{"user_id":"4388906148312295","sort_type":2,"cursor":"0"}' \
    --compressed
    `
    return request(api)
}
/**
 * 点赞
 * @param item_id 文章id
 * @param cookie  用户cookie
 * @returns 
 */
export function starArticle(item_id:string,userInfo:JuejinUserInfo){
    const api=`
    curl 'https://api.juejin.cn/interact_api/v1/digg/save?aid=${userInfo.aid}&uuid=${userInfo.uuid}' \
    -H 'authority: api.juejin.cn' \
    -H 'pragma: no-cache' \
    -H 'cache-control: no-cache' \
    -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'content-type: application/json' \
    -H 'accept: */*' \
    -H 'origin: https://juejin.cn' \
    -H 'sec-fetch-site: same-site' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-dest: empty' \
    -H 'referer: https://juejin.cn/' \
    -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'cookie: ${userInfo.cookie}' \
    --data '{"item_id":"${item_id}","item_type":2,"client_type":2608}' \
    --compressed
    `
    return request(api)
}
/**
 * 查看文章
 * @param item_id 
 * @returns 
 */
export function viewArticle(item_id:string){
    const api=`curl https://juejin.cn/post/${item_id}`
    return request(api)
}

/**
 * 签到
 */
export const  signIn=async()=>{
    const api= `curl 'https://api.juejin.cn/growth_api/v1/check_in?aid=2608&uuid=7016499237660657191&spider=0&_signature=_02B4Z6wo00101P6tfmgAAIDBAOECW3n2OSD-qXrAAFyaO8B5qijbaxpPoXr7fZaUJ8ko9YMaMbeaE97VEAdR.2T6pkgRJE6WXkhiUmnUEZj8Rbe5EPhzYFFXbTL.NPa71iJJAtbzZQM2qVV7de' \
    -H 'authority: api.juejin.cn' \
    -H 'accept: */*' \
    -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H 'cookie: ${NEW_COOKIE}' \
    -H 'origin: https://juejin.cn' \
    -H 'pragma: no-cache' \
    -H 'referer: https://juejin.cn/user/center/signin?from=main_page' \
    -H 'sec-ch-ua: "Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' \
    --data-raw '{}' \
    --compressed`
    const res=await request(api)
    console.log(res)
}