import query from '../db/mysql'
import { sendEmail } from '../tools/email'
import { sendMsg } from './robot'
const shell = require('shelljs')
const schedule = require('node-schedule')
interface WebsiteUser {
    name: string
    'juejin-cookie': string
}
// 签到
function signIn(cookie: string) {
    return `
    curl 'https://api.juejin.cn/growth_api/v1/check_in?aid=2608&uuid=7016499237660657191&spider=0&msToken=YlLhYrRtqdnn0IKunygg9DJjWrBLq-X3I5J7uQfSTnfAoA5PT4jXD7aSnmiAaLbayOWE7Vf85e_JiRvLgYyfCB5Y4ycLcXAUmnNGcaoK7cYHLzeRimJEvBnDVSP2k0It&a_bogus=Y74dvOh6Msm1V7f2BwDz9y6E7Iu0YW5ZgZENkiUCttLL' \
    -H 'accept: */*' \
    -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -H 'cookie: _ga=GA1.2.151728167.1605962485; __tea_cookie_tokens_2608=%257B%2522user_unique_id%2522%253A%25227016499237660657191%2522%252C%2522web_id%2522%253A%25227016499237660657191%2522%252C%2522timestamp%2522%253A1641894488265%257D; store-region=us; store-region-src=uid; _tea_utm_cache_2018={%22utm_source%22:%22push%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22jsjh2404%22}; _tea_utm_cache_2608={%22utm_source%22:%22push%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22jsjh2404%22}; csrf_session_id=7e5583d3207462067d575294247b1be6; passport_csrf_token=7be072e5f7f29d4ef97adc14d532f92a; passport_csrf_token_default=7be072e5f7f29d4ef97adc14d532f92a; n_mh=eqGn3kR2aKQuug3nOv98c5xP01S4w0EjSO78rjf1mNA; passport_auth_status=90e2fba9684fec9e7b67a0000aad8bfa%2C; passport_auth_status_ss=90e2fba9684fec9e7b67a0000aad8bfa%2C; sid_guard=760bf122bf811e125f57a731e0703947%7C1717049758%7C31536000%7CFri%2C+30-May-2025+06%3A15%3A58+GMT; uid_tt=be6c3a82c3616217f56c513abad5a71a; uid_tt_ss=be6c3a82c3616217f56c513abad5a71a; sid_tt=760bf122bf811e125f57a731e0703947; sessionid=760bf122bf811e125f57a731e0703947; sessionid_ss=760bf122bf811e125f57a731e0703947; sid_ucp_v1=1.0.0-KDBmYTcwYWE2NWIxMTg5YTNlYmNjZDc2MDYxYjhiM2NmNDBkZGIwZjgKFwjn6bC__fXlBxCes-CyBhiwFDgCQPEHGgJsZiIgNzYwYmYxMjJiZjgxMWUxMjVmNTdhNzMxZTA3MDM5NDc; ssid_ucp_v1=1.0.0-KDBmYTcwYWE2NWIxMTg5YTNlYmNjZDc2MDYxYjhiM2NmNDBkZGIwZjgKFwjn6bC__fXlBxCes-CyBhiwFDgCQPEHGgJsZiIgNzYwYmYxMjJiZjgxMWUxMjVmNTdhNzMxZTA3MDM5NDc; msToken=i8U0gfU_-tC3Zk0rlmmhY64ns0HcxPHWTn0FGboWOaLm82UsTME6tHvWPfdmCaB8SBqc9h8WD49fvtMOJF8YGqzss_CfkatWX0U0l_gct0LeyUNWtKZ4wahjk9cIt1fl9Q==' \
    -H 'origin: https://juejin.cn' \
    -H 'pragma: no-cache' \
    -H 'priority: u=1, i' \
    -H 'referer: https://juejin.cn/user/center/signin?from=main_page' \
    -H 'sec-ch-ua: "Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' \
    -H 'x-secsdk-csrf-token: 0001000000019f3c71f7e3dd18df3f66336b596b23fbca0ac432ace77fe6f31574315ca5d7f917d46f23bf7b3c6a' \
    --data '{}'
  `
}
// 抽奖
function luckyDraw(cookie: string) {
    return `
    curl 'https://api.juejin.cn/growth_api/v1/lottery/draw?aid=2608&uuid=7016499237660657191&spider=0&msToken=YlLhYrRtqdnn0IKunygg9DJjWrBLq-X3I5J7uQfSTnfAoA5PT4jXD7aSnmiAaLbayOWE7Vf85e_JiRvLgYyfCB5Y4ycLcXAUmnNGcaoK7cYHLzeRimJEvBnDVSP2k0It&a_bogus=dv-Q6ch6Msm1V7f287Dz9y6E7lR0YW4YgZENkEPNgtLF' \
  -H 'accept: */*' \
  -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'cookie: _ga=GA1.2.151728167.1605962485; __tea_cookie_tokens_2608=%257B%2522user_unique_id%2522%253A%25227016499237660657191%2522%252C%2522web_id%2522%253A%25227016499237660657191%2522%252C%2522timestamp%2522%253A1641894488265%257D; store-region=us; store-region-src=uid; _tea_utm_cache_2018={%22utm_source%22:%22push%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22jsjh2404%22}; _tea_utm_cache_2608={%22utm_source%22:%22push%22%2C%22utm_medium%22:%22web%22%2C%22utm_campaign%22:%22jsjh2404%22}; csrf_session_id=7e5583d3207462067d575294247b1be6; passport_csrf_token=7be072e5f7f29d4ef97adc14d532f92a; passport_csrf_token_default=7be072e5f7f29d4ef97adc14d532f92a; n_mh=eqGn3kR2aKQuug3nOv98c5xP01S4w0EjSO78rjf1mNA; passport_auth_status=90e2fba9684fec9e7b67a0000aad8bfa%2C; passport_auth_status_ss=90e2fba9684fec9e7b67a0000aad8bfa%2C; sid_guard=760bf122bf811e125f57a731e0703947%7C1717049758%7C31536000%7CFri%2C+30-May-2025+06%3A15%3A58+GMT; uid_tt=be6c3a82c3616217f56c513abad5a71a; uid_tt_ss=be6c3a82c3616217f56c513abad5a71a; sid_tt=760bf122bf811e125f57a731e0703947; sessionid=760bf122bf811e125f57a731e0703947; sessionid_ss=760bf122bf811e125f57a731e0703947; sid_ucp_v1=1.0.0-KDBmYTcwYWE2NWIxMTg5YTNlYmNjZDc2MDYxYjhiM2NmNDBkZGIwZjgKFwjn6bC__fXlBxCes-CyBhiwFDgCQPEHGgJsZiIgNzYwYmYxMjJiZjgxMWUxMjVmNTdhNzMxZTA3MDM5NDc; ssid_ucp_v1=1.0.0-KDBmYTcwYWE2NWIxMTg5YTNlYmNjZDc2MDYxYjhiM2NmNDBkZGIwZjgKFwjn6bC__fXlBxCes-CyBhiwFDgCQPEHGgJsZiIgNzYwYmYxMjJiZjgxMWUxMjVmNTdhNzMxZTA3MDM5NDc; msToken=WRDdUq-OBdZQh3z4m0lVDNFDHDv2LpnscsRVVoS1GPnpWY8Lq3xpDTwvI0dYI_dPmSIjIzSNgCKhu1uTa7I21ere050hwdSLlP4ws3YiaCy9HADNtb5-HPVnhL5uXqDE' \
  -H 'origin: https://juejin.cn' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://juejin.cn/user/center/lottery?from=sign_in_success' \
  -H 'sec-ch-ua: "Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' \
  -H 'x-secsdk-csrf-token: 0001000000019f3c71f7e3dd18df3f66336b596b23fbca0ac432ace77fe6f31574315ca5d7f917d46f23bf7b3c6a' \
  --data '{}'
    `
}

export const juejinJob = async () => {
    let list = await query<WebsiteUser[]>('SELECT * from `website-user` ', [])
    let cookie = list[0]['juejin-cookie']
    try {
        let res = JSON.parse(shell.exec(signIn(cookie), { silent: true }))
        if (res.err_no == 0 || res.err_no == 15001) {
            console.log('😃😃😃', '签到成功')
            shell.exec(luckyDraw(cookie), { silent: true })
        }
    } catch (error) {
        sendMsg('掘金签到失败')
    }
}

// 每天早上7点执行
schedule.scheduleJob({ second: 0, minute: 0, hour: 7 }, () => {
    juejinJob()
})
