import query from '../db/mysql'
import { EtfItem } from '../types/eft'
import { getEtfPrice } from '../tools/eft-tools'
import { sendEmail } from '../tools/email'
import {sendMsg} from './robot'
const schedule = require('node-schedule')
import dayjs = require('dayjs')
const rule = '30 * * * * *'

schedule.scheduleJob(rule, () => {
    let start = dayjs().format('YYYY-MM-DD') + ' 09:30:00'
    let end = dayjs().format('YYYY-MM-DD') + ' 15:00:00'

    let isBefore = dayjs().isBefore(end)
    let isAfter = dayjs().isAfter(start)
    console.log(isBefore,isAfter)
    if (!(isBefore && isAfter)) {
        console.log('不在交易时间内')
        return
    }else{
        etfJob()
    }

    // etfJob()
})
export const etfJob = async () => {
    /**
     * 1. 把所有的数据查出来
     * 2. for循环
     * 3. 判断
     */

    let list = await query<EtfItem[]>('SELECT * from `etf` WHERE status = ? ', [
        `running`,
    ])
    for (let i = 0; i < list.length; i++) {
        let { code, buy1, buy2, sell1, sell2, name } = list[i]
        const price = await getEtfPrice(code)
        let subject = `${name} ${price}`
        // sendEmail(subject)
        // buy2<buy2
        console.log(
            '😑😑😑',
            name,
            '当前价格:',
            price,
            buy1,
            buy2,
            sell1,
            sell2,
            'buy1',
            price<buy1,
            'buy2',
            price<buy2,
            'sell1',
            price>sell1,
            'sell2',
            price>sell2
        )
        if (price < buy1) {
            if (price < buy2) {
                sendMsg(`${subject} 买买买😀😀😀`)
            } else {
                sendMsg(`${subject} 买😀`)
            }
        }
        // sell1< sell2
        if (price > sell1) {
            if (price > sell2) {
                sendMsg(`${subject} 卖卖卖😀😀😀`)
            } else {
                sendMsg(`${subject} 卖😀`)
            }
        }
    }
}
