import axios from 'axios'
import dayjs = require('dayjs')
import { md5 } from './md5'
import trader from '../router/trader'
import { TraderItem } from '../router/trader';
const VERSION = '1.0.1'
interface fetchBalanceParams {
    version: string
    parterid: string
    ts: string
    sign: string
}
export const getAllBalance=async(list:TraderItem[])=>{
    for (let i = 0; i < list.length; i++) {
       let res=await fetchBalance(getParams(list[i]))
        list[i]={
            ...list[i],
            balance:res?.balance,
            error:res?.error
        }
    }
    return list

}
export function getParams({ parterid, key }: TraderItem) {
    const ts = dayjs().format('YYYYMMDDHHmmss')
    const params: fetchBalanceParams = {
        version: VERSION,
        ts,
        parterid,
        sign: md5(key + VERSION + parterid + ts + key),
    }
    return params
}

export function fetchBalance(data: fetchBalanceParams) {
    return axios.post('http://api.qdwtict.com/balance.do', data).then(res=>res.data).then(res=>{
        if(res.code=='00000'){
            return {
                success:true,
                balance:res.result.balance
            }
        }else{
            return {
                success:false,
                error:res.msg,
                balance:0
            }
        }
    })
}

