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
    console.log('platform', data.platform)
    try {
        switch (data.platform) {
            case 'AM':
                return await fetchAMBalance(data)
            case 'JH':
                return await fetchJHBalance(data)
            case 'JH2':
                return await fetchJH2Balance(data)
            case 'WH':
                return await fetchWHBalance(data)
            case 'XJ':
                return await fetchXJBalance(data)
            case 'ZX':
                return await fetchZXBalance(data)
            default:
                return Promise.resolve({
                    success: false,
                    balance: 0,
                    error: 'unknown platform',
                })
        }
    } catch (error) {
        console.log('😀😀😀', error)
        return Promise.resolve({
            success: false,
            balance: 0,
            error: error,
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

function fetchWHBalance(data: TraderItem) {
    const ts = dayjs().format('YYYYMMDDHHmmss')
    const reqData = {
        app_id: data.parterid,
        sign: md5(`password=${data.key}`).toUpperCase(),
    }
    const url =
        data.link || 'http://frp.fjwolf.com:9090/frp/api/merchant/querybalance'
    return axios
        .post(url, reqData)
        .then((res) => res.data)
        .then((res) => {
            if (res.result_code == '00000') {
                return {
                    success: true,
                    balance: res.balance,
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

function fetchXJBalance(data: TraderItem) {
    const reqData = {
        szAgentId: data.parterid,
        szVerifyString: md5(`szAgentId=${data.parterid}&szKey=${data.key}`),
    }
    console.log('xj',`szAgentId=${data.parterid}&szKey=${data.key}`, reqData)
    const url =
        data.link || 'http://101.37.65.140:10186/plat/api/old/queryBalance'
    return axios
        .post(url, qs.stringify(reqData))
        .then((res) => res.data)
        .then((res) => {
            console.log('🍎🍎🍎xj', res)
            if (res.nRtn == '0') {
                return {
                    success: true,
                    balance: res.fBalance,
                }
            } else {
                return {
                    success: false,
                    error: res.szRtnCode,
                    balance: 0,
                }
            }
        })
}

function fetchZXBalance(data: TraderItem) {
    const request_time = dayjs().format('YYYYMMDDHHmmss')
    const reqData = {
        mrch_no: data.parterid,
        request_time,
        sign: md5(
            'mrch_no' + data.parterid + 'request_time' + request_time + data.key
        ),
    }
    const url =
        data.link || 'http://balance.julives.com:9080/zxpaycore/v2/balance'
    return axios
        .post(url, reqData)
        .then((res) => res.data)
        .then((res) => {
            if (res.code == '2') {
                return {
                    success: true,
                    balance: res?.data?.balance,
                }
            } else {
                return {
                    success: false,
                    error: res.message,
                    balance: 0,
                }
            }
        })
}
