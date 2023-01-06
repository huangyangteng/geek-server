import query from '../db/mysql'
import { sendEmail } from '../tools/email';
const shell=require('shelljs')
const schedule = require('node-schedule')
interface WebsiteUser {
    name: string
    'juejin-cookie': string
}
// 签到
function signIn(cookie:string){
    return `
     curl 'https://api.juejin.cn/growth_api/v1/check_in?_signature=_02B4Z6wo00101ko.H4gAAIDDtHNjubVswAZKOxsAAPOuAAlx6VxXpAuTLBl4IC1eYOBrCQaJL2bxRG2WMew4GQseXw5FTF7DWUseoJnrvSHnaYcWquty-lQ3DaLLkODkvNHe9Msoy7jWBaIz39' \
        -H 'authority: api.juejin.cn' \
        -H 'pragma: no-cache' \
        -H 'cache-control: no-cache' \
        -H 'sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"' \
        -H 'sec-ch-ua-mobile: ?0' \
        -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36' \
        -H 'content-type: application/json' \
        -H 'accept: */*' \
        -H 'origin: https://juejin.cn' \
        -H 'sec-fetch-site: same-site' \
        -H 'sec-fetch-mode: cors' \
        -H 'sec-fetch-dest: empty' \
        -H 'referer: https://juejin.cn/' \
        -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
        -H 'cookie:${cookie} ' \
	--data '{}' \
        --compressed
  `
}
// 抽奖
function luckyDraw(cookie:string){
    return `
    curl 'https://api.juejin.cn/growth_api/v1/lottery/draw' \
        -H 'authority: api.juejin.cn' \
        -H 'pragma: no-cache' \
        -H 'cache-control: no-cache' \
        -H 'sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"' \
        -H 'sec-ch-ua-mobile: ?0' \
        -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36' \
        -H 'content-type: application/json' \
        -H 'accept: */*' \
        -H 'origin: https://juejin.cn' \
        -H 'sec-fetch-site: same-site' \
        -H 'sec-fetch-mode: cors' \
        -H 'sec-fetch-dest: empty' \
        -H 'referer: https://juejin.cn/' \
        -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
        -H 'cookie: ${cookie}' \
	--data '{}' \
        --compressed
    `
}



export const juejinJob = async () => {
    let list = await query<WebsiteUser[]>('SELECT * from `website-user` ', [])
    let cookie=list[0]['juejin-cookie']
    try {
        let res=JSON.parse(shell.exec(signIn(cookie),{silent:true}))
        if(res.err_no==0 || res.err_no==15001){
            console.log('😃😃😃','签到成功')
            shell.exec(luckyDraw(cookie),{silent:true})
        }
    } catch (error) {
        sendEmail('掘金签到失败')
    }
   
    
}

// 每天早上7点执行
schedule.scheduleJob({ second: 0, minute: 0, hour: 7 }, () => {
    juejinJob()
})
