import * as Router from 'koa-router'
const router = new Router()
import { getRes, arrayToHump, formatTime } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'
import { EtfItem } from '../types/eft'
import dayjs = require('dayjs')
import { getEftInfo } from '../tools/eft-tools'
import { etfJob } from '../job/etf-job';

/**
 * 添加记录/更新记录
 */
router.post('/', async (ctx) => {
    let { id, code, buy1, buy2, sell1, sell2 } = ctx.request.body
    if (id) {
        //id存在说明是修改数据
        const res = await query<EtfItem[]>(
            'SELECT * from `etf` WHERE `id`=? ',
            [id]
        )
        code = res[0].code
        // 获取基金信息
        const etfInfo: any = await getEftInfo(code)
        const [codeE, name, price] = etfInfo
        let req = {
            ...res[0],
            price,
            ...ctx.request.body,
        }
        if (res.length > 0) {
            console.log('更新数据')
            //更新数据
            await query<OkPacket>(
                'UPDATE etf SET price=?,buy1=?,buy2=?,sell1=?,sell2=?,status=? WHERE id=?',
                [
                    req.price,
                    req.buy1,
                    req.buy2,
                    req.sell1,
                    req.sell2,
                    req.status,
                    String(id),
                ]
            )
        }
    } else {
        // 新增数据
        // 获取基金信息
        const etfInfo: any = await getEftInfo(code)
        const [codeE, name, price] = etfInfo
        //处理info
        let req = {
            code,
            buy1,
            buy2,
            sell1,
            sell2,
            name,
            price,
            status: 'running',
            info: JSON.stringify({
                priceA: etfInfo,
                link: `https://q.fund.sohu.com/${code}/index.shtml`,
            }),
        }
        if (!code || !buy1 || !sell1) {
            ctx.body = getRes<string>(5001, '参数不完整')
            return
        }
        await query<OkPacket>('INSERT INTO etf SET?', req)
    }
    ctx.body = getRes<string>(2000, 'success')
})

router.get('/:code', async (ctx) => {
    const etfInfo: any = await getEftInfo(ctx.params.code)
    ctx.body = getRes<string>(2000, etfInfo)
})

router.get('/',async ctx=>{
    let res=await query<EtfItem[]>('SELECT * from `etf`',[])
    ctx.body = getRes<EtfItem[]>(2000, res)
})

export default router.routes()
