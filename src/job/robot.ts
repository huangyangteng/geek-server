import { request } from "../tools"
import dayjs = require('dayjs')
const schedule = require('node-schedule')
const shell=require('shelljs')
export const sendMsg = async(msg:string) => {
    const api=`
    curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7693ec9b-2c69-47c5-b683-a6811e939ee5' \
   -H 'Content-Type: application/json' \
   -d '
   {
        "msgtype": "text",
        "text": {
            "content": "${msg}"
        }
   }'

    `
    const res=await request(api)
    console.log(res)
    return res
}
function isWeekend(){
    let week=dayjs().day()
    if(week==6 || week==0)return true
    return false
}

schedule.scheduleJob({ second: 0, minute: 40, hour: 9 }, () => {
    if(!isWeekend()){
        sendMsg(`🐔🐔🐔早上好，请填写今日份的tapd：https://www.tapd.cn/my_worktable/index/todo`)
    }
   
})
schedule.scheduleJob({ second: 0, minute: 40, hour: 17 }, () => {
    if(!isWeekend()){
        sendMsg(`🐥🐥🐥下午好，请填写今日份的tapd：https://www.tapd.cn/my_worktable/index/todo`)
    }
   
})
// schedule.scheduleJob({ second: 0, minute: 20, hour: 11 }, () => {
//     if(!isWeekend()){
//         // sendMsg('吃饭提醒：🍚🍚🍚🍚🍚🍚')
//     }
   
// })

// schedule.scheduleJob({ second: 0, minute: 43, hour: 21 }, () => {
//     console.log('😝😝😝',isWeekend())
//     // sendMsg('吃饭提醒：🍚🍚🍚🍚🍚🍚')
//  })
const fetchGithub=async()=>{
    const api=`
    curl 'https://githubedu.com/github/submit' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://edugithub.top' \
  -H 'Referer: https://edugithub.top/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data '{"userSession":"YjhWF7zWqsXPuGYN6DlEsUuLiqO4fobPt4Io34vXihSNjPN4","schoolId":1079,"key":"9JQQV2KE-QUNYF6XJ-8M4WOJVO-FQB76NQZ-NGGE69CM","keyToken":"ECBDYN0IKS55AGXF7GFJ4SJT5IFXBKH12FKDW6GJI3QE5B16E6YTNZ54ZHS5ZJII1GJK4X6EEJSNN71J3SB4G03LWDMOPY6BJLJ4"}' \
  --compressed
    `
    // const res=await request(api)
    // console.log('fetch github',res,'😊😊😊')
    // sendMsg(JSON.stringify(res.data))
}
// fetchGithub()
// 每5分钟请求一次
schedule.scheduleJob('*/5 * * * *',function(){
    fetchGithub()
})