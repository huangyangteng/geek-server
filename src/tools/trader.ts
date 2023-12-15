import axios from 'axios'
import dayjs = require('dayjs')
import { md5 } from './md5'
import { TraderItem } from '../router/trader'
var qs = require('querystring')

const VERSION = '1.0.1'
interface fetchBalanceParams {
    version: string
    parterid: string
    ts: string
    sign: string
}
export const getAllBalance = async (list: TraderItem[]) => {
    for (let i = 0; i < list.length; i++) {
        let res: any = await fetchBalance(list[i])
        list[i] = {
            ...list[i],
            balance: res?.balance,
            frozen_balance: res?.frozen_balance || 0,
            error: res?.error,
        }
    }
    return list
}
const fetchBalance = async (data: TraderItem) => {
    switch (data.platform) {
        case 'AM':
            return await fetchAMBalance(data)
        case 'JH':
            return await fetchJHBalance(data)
        case 'JH2':
            return await fetchJH2Balance(data)
        default:
            return Promise.resolve({
                success: false,
                balance: 0,
                error: 'unknown platform',
            })
    }
}

function fetchAMBalance(data: TraderItem) {
    const ts = dayjs().format('YYYYMMDDHHmmss')
    const reqData: fetchBalanceParams = {
        version: VERSION,
        ts,
        parterid: data.parterid,
        sign: md5(data.key + VERSION + data.parterid + ts + data.key),
    }
    const url = data.link || 'http://api.qdwtict.com/balance.do'
    return axios
        .post(url, reqData)
        .then((res) => res.data)
        .then((res) => {
            if (res.code == '00000') {
                return {
                    success: true,
                    balance: res.result.balance,
                }
            } else {
                return {
                    success: false,
                    error: res.msg,
                    balance: 0,
                }
            }
        })
}

function fetchJHBalance(data: TraderItem) {
    const ts = dayjs().format('YYYYMMDDHHmmss')
    const reqData = {
        userid: data.parterid,
        create_time: ts,
        sign: md5(ts + data.parterid + data.key).toUpperCase(),
    }
    const url = data.link || 'http://47.104.129.40:80/user/balance.do'
    return axios
        .post(url, qs.stringify(reqData))
        .then((res) => res.data)
        .then((res) => {
            console.log('🐔🐔🐔', res)
            if (res.status == '0') {
                return {
                    success: true,
                    balance: res.balance,
                    frozen_balance: res.frozen_balance,
                }
            } else {
                return {
                    success: false,
                    error: res.msg,
                    balance: 0,
                    frozen_balance: 0,
                }
            }
        })
}

function fetchJH2Balance(data: TraderItem) {
    const ts = dayjs().format('YYYYMMDDHHmmss')
    const reqData = {
        userId: data.parterid,
        sign: md5(data.parterid + data.key),
    }
    console.log('🐔🐔🐔', reqData)
    const url = data.link || 'http://47.104.129.40:80/user/balance.do'
    return axios
        .post(url, qs.stringify(reqData))
        .then((res) => res.data)
        .then((res) => {
            if (res.status == 'success') {
                return {
                    success: true,
                    balance: res.balance / 1000,
                    frozen_balance: res.frozen_balance / 1000,
                }
            } else {
                return {
                    success: false,
                    error: res.msg,
                    balance: 0,
                    frozen_balance: 0,
                }
            }
        })
}
