import { request } from "../tools"

const schedule = require('node-schedule')
const shell=require('shelljs')
const sendMsg = async(msg:string) => {
    const api=`
    curl https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7693ec9b-2c69-47c5-b683-a6811e939ee5' \
    -H 'Content-Type: application/json' \
    -d '
    {
         "msgtype": "text",
         "text": {
             "content": ${msg}
         }
    }'
    `
    const res=await request(api)
    return res
}

// 每天下午五点半执行
schedule.scheduleJob({ second: 0, minute: 30, hour: 17 }, () => {
    // shell.exec(sendMsg('下班提醒：五点半了，该收拾收拾下班了！！！'))
})
// schedule.scheduleJob({ second: 0, minute: 51, hour: 16 }, () => {
//     console.log('16.51了')
//     // shell.exec(sendMsg('5点半了，可以收拾收拾下班了!!!'))
// })