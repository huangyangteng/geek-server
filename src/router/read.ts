import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import { getRes, readFileAndParse, walkDir, getExt, uuid, writeFile } from '../tools/index';
import { generateResource, getOutput, getCodec } from '../tools/watch';
import { WatchItemContent, WatchChildItem } from '../types/watchType';
import { HistoryItem } from '../types/history';
import dayjs = require('dayjs');

const HISTORY_PATH = path.join(__dirname, '../data/read-history.json')

// add history
router.post('/history',async ctx=>{
    const histories:HistoryItem[] =readFileAndParse(HISTORY_PATH)
    const {userId,itemId,itemName='',itemDetail=''}=ctx.request.body
    const index=histories.findIndex(history=>history.itemId===itemId && userId===userId)
    if(index !==-1){
        const cur=histories[index]
        histories.splice(index,1,{
            ...cur,
            itemDetail,
            date:dayjs().format('YYYY-DD-MM HH:mm:ss')
        })
    }else{
        histories.push({
            id:uuid(),
            userId,
            itemId,
            itemName,
            itemDetail,
            date:dayjs().format('YYYY-DD-MM HH:mm:ss')
        })
    }
    writeFile<HistoryItem[]>(HISTORY_PATH,histories)

    ctx.body=getRes<string>(2000,'记录历史数据成功')

})
// query history
router.get('/history/:userId',async ctx=>{
    const histories:HistoryItem[] =readFileAndParse(HISTORY_PATH)

    let {start,end}=ctx.query
    let list=histories.filter(item=>item.userId==ctx.params.userId)
    // 根据开始时间和结束时间查询
    if(start && end){
        start=dayjs(start).subtract(1,'ms')
        end=dayjs(end).add(1, 'ms')
        list=list.filter(item=>{
           return dayjs(item.date).isAfter(start) && dayjs(item.date).isBefore(end)
        })
    }

    ctx.body=getRes<HistoryItem[]>(2000,list.reverse())
})

export default router.routes()
