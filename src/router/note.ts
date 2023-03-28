import * as Router from 'koa-router'

const router = new Router()
import {
    getRes,
    getNow,
    convertToUnderLine,
    convertToHump,
    formatTime,
} from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'
import { AddNotePayloadType, NoteItem } from '../types/note'
import { handleInfoLink } from '../tools/note'

// add
router.post('/', async (ctx) => {
    let value=ctx.request.body.value
    value=await handleInfoLink(value)
    // console.log(value)
    // debugger
    const req: AddNotePayloadType = {
        ...ctx.request.body,
        createDate: getNow(),
        updateDate: getNow(),
        value
    }

    if (!req.value && !req.userId) {
        ctx.body = getRes<string>(5000, '请求参数不完整')
        return
    }
    const insertInfo = await query<OkPacket>(
        'INSERT INTO note SET?',
        convertToUnderLine(req)
    )
    ctx.body = getRes<number>(2000, insertInfo.insertId)
})
// update 先根据id找到数据
router.put('/',async ctx=>{
    const req: NoteItem = {
        ...ctx.request.body,
        updateDate: getNow(),
    }
    if (!req.id && !req.userId) {
        ctx.body = getRes<string>(5000, '请求参数不完整')
        return
    }
    const res=await query<NoteItem[]>('SELECT * from `note` WHERE `id`=? AND `user_id`=?',[req.id,req.userId])
    if(res.length>0){
        console.log('更新数据')
        //更新数据
        await query<OkPacket>('UPDATE note SET value=?,update_date=? WHERE id=? AND `user_id`=?',[req.value,req.updateDate,req.id,req.userId])
    }
   
    ctx.body = getRes<string>(2000, 'update success')
})

//get list
router.get('/:id', async (ctx) => {
    const userId = ctx.params.id
    const connectId = ctx.query.connectId || -1
    const tagId=ctx.query.tagId || ''
    let tagSql=tagId?' AND `tag` = ?':''
    const res = await query<NoteItem[]>(
        'SELECT * from note WHERE `user_id` = ? AND `connect_id` = ?'+tagSql+' ORDER BY `update_date` DESC ',
        [userId, connectId,tagId]
    )
    let list: NoteItem[] = convertToHump(res)
    list = list.map((item) => ({
        ...item,
        createDate: formatTime(item.createDate),
        updateDate: formatTime(item.updateDate),
    }))
    ctx.body = getRes<NoteItem[]>(2000, list)
})

router.post('/delete', async (ctx) => {
    let deleteIds = ctx.request.body.id
    const deleteInfo = await query<OkPacket>(
        'DELETE FROM `note` WHERE id IN ' + `(${deleteIds})`
    )
    ctx.body = getRes<string>(
        2000,
        '删除了' + deleteInfo.affectedRows + '条数据,id是'+deleteIds
    )
})

export default router.routes()
