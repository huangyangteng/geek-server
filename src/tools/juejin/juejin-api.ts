import { JuejinUserInfo } from '../../types/juejin';
import { request } from '../index';
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