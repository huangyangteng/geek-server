import * as Router from 'koa-router'
const router = new Router()
import { getRes, arrayToHump, formatTime } from '../tools/index';
import { HistoryItem } from '../types/history';
import query from '../db/mysql';
import { OkPacket } from '../types/index';
import dayjs = require('dayjs');


/**
 * 添加记录
 */
router.post('/',async ctx=>{
    let {itemId,type,info,userId,groupId=''}=ctx.request.body
    const currentTime=dayjs().format('YYYY-MM-DD hh:mm:ss')
    //处理info
    let req={
        item_id:itemId,
        type,
        info,
        created_time:currentTime,
        update_time:currentTime,
        user_id:userId,
        group_id:groupId
    }
    if(!itemId || !type || !userId){
        ctx.body=getRes<string>(5001,'参数不完整')
        return 
    }
    // 判断当前用户是否已经存在当前item
    const res=await query<HistoryItem[]>('SELECT * from `history` WHERE `item_id`=? AND `user_id`=?',[itemId,userId])
    if(res.length>0){
        console.log('更新数据')
        //更新数据
        await query<OkPacket>('UPDATE history SET info=?,update_time=? WHERE item_id=? AND `user_id`=?',[info,currentTime,String(itemId),userId])
    }else{
        console.log('新增数据')
        // 插入数据
        await query<OkPacket>('INSERT INTO history SET?',req)
    }
    

    ctx.body=getRes<string>(2000,'记录历史数据成功')

})
/**
 * 获取列表
 */
router.get('/',async ctx=>{
    let {userId,startTime,endTime,type,groupId=''}=ctx.query
   
    if(!userId){
        ctx.body=getRes<string>(5000,'参数不完整')
    }
    let querySql='SELECT * from history WHERE   '
    if(userId){
        querySql+=`${`user_id`}=${userId}`
    }
    if(startTime && endTime){
        querySql+=`  AND ${`update_time`} >= '${startTime}' AND ${`update_time`} <= '${endTime}' `
    }
   
    if(type){
        querySql+=` AND type='${type}'`
    }
    
    if(groupId){
        querySql+=` AND group_id= '${groupId}'`
    }
    
    // let res=await query<HistoryItem[]>('SELECT * from `history` WHERE  `user_id`=? AND `update_time` >= ? AND `update_time` <=? AND type=?',[userId,startTime,endTime,type])
    let res=await query<HistoryItem[]>(querySql)
    const result=arrayToHump<HistoryItem>(res).map(item=>({
        ...item,
        createdTime:formatTime(item.createdTime),
        updateTime:formatTime(item.updateTime),

    }))
    
    ctx.body=getRes<HistoryItem[]>(2000,result.reverse())
})


export default router.routes()
