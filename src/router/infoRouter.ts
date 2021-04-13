import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import { getRes, uuid, readFileAndParse, writeFile } from '../tools/index'
import { QueryItemType } from '../types/infoType'

const DATA_PATH = path.join(__dirname, '../data/info.json')

router.get('/', async ctx => {
    let data:QueryItemType[] = readFileAndParse(DATA_PATH)
    const {query}=ctx.query
    if(query){
        data=data.filter(item=>{
            return item.answer.includes(query)||item.value.includes(query)||item.desc.includes(query)
        })
    }
  
    ctx.body = getRes<QueryItemType[]>(2000, data)
})

router.post('/', async ctx => {
    const body: QueryItemType = {
        ...ctx.request.body,
        id: uuid(),
        state: 1
    }
    const list: QueryItemType[] = readFileAndParse(DATA_PATH)
    const newList = [...list, body]
    try {
        writeFile<QueryItemType[]>(DATA_PATH, newList)
        ctx.body = getRes<QueryItemType>(2000, body.id)
    } catch (error) {
        ctx.body = getRes<QueryItemType>(5000, '新增查询失败失败,服务器端错误')
    }
})
router.put('/:id', async ctx => {
    const list: QueryItemType[] = readFileAndParse(DATA_PATH)
    const resultIndex = list.findIndex(item => item.id == ctx.params.id)
    if (resultIndex == -1) {
        ctx.body = getRes<string>(5000, '不存在该数据')
        return
    }
    const newList = Object.assign({}, list[resultIndex], {
        ...ctx.request.body
    })
    list.splice(resultIndex, 1, newList)
    writeFile<QueryItemType[]>(DATA_PATH, list)
    ctx.body = getRes<QueryItemType>(2000, newList)
})

router.delete('/:id', async ctx => {
    const list: QueryItemType[] = readFileAndParse(DATA_PATH)
    const resultIndex = list.findIndex(item => item.id == ctx.params.id)
    if (resultIndex != -1) {
        const newProject = Object.assign({}, list[resultIndex], {
            state: 0
        })
        list.splice(resultIndex, 1, newProject)
        writeFile<QueryItemType[]>(DATA_PATH, list)
        ctx.body = getRes<number>(2000, ctx.params.id)
        return
    } else {
        ctx.body = getRes<string>(5000, '不存在该id')
        return
    }
})

export default router.routes()
