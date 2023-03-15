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

schedule.scheduleJob({ second: 0, minute: 40, hour: 15 }, () => {
    if(!isWeekend()){
        sendMsg('🍎🍎🍎动动脖子:'+'https://www.bilibili.com/video/BV1YN411F7RP')
    }
   
})
schedule.scheduleJob({ second: 0, minute: 40, hour: 16 }, () => {
    if(!isWeekend()){
        sendMsg('🏀🏀🏀动动脖子:'+'https://www.bilibili.com/video/BV1YN411F7RP')
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