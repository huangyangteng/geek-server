import query from '../db/mysql'

const schedule = require('node-schedule')
interface WebsiteUser {
    name: string
    juejinCookie: string
}

export const juejinJob = async () => {
    let list = await query<WebsiteUser[]>('SELECT * from `website-user` ', [])
    console.log(list)
}

// 每天早上7点执行
schedule.scheduleJob({ second: 0, minute: 0, hour: 7 }, () => {})
