import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import { getRes, uuid, readFileAndParse, writeFile } from '../tools/index'
import { UserItem } from '../types/userTypes'

const PROJECT_PATH = path.join(__dirname, '../data/user.json')

router.get('/', async ctx => {
    const data = readFileAndParse(PROJECT_PATH)
    ctx.body = getRes<UserItem[]>(2000, data)
})
//curl  http://localhost:9999/user/query?name=&phone
router.get('/query', async ctx => {
    // 通过name,sex,age查询
    const data:UserItem[] = readFileAndParse(PROJECT_PATH)
    let {name='',phone='',pageNum=1,pageSize=10}=ctx.query
    let tmp=data
    if(name){
        name=name.toLowerCase()
        tmp=data.filter(item=>  item.name.toLowerCase().indexOf(name) !=-1)
    }
    if(phone){
        tmp=data.filter(item=>item.phone==phone)
    }
    tmp=tmp.slice((pageNum-1)*pageSize,pageNum*pageSize)
    const list=getRes<UserItem[]>(2000, tmp)
    ctx.body =list
})

//登录
router.post('/login',async ctx=>{
    const {phone,password}=ctx.request.body
    const projects: UserItem[] = readFileAndParse(PROJECT_PATH)
    // 1. 判断该用户是否不存在
    const result = projects.find(item => item.phone == phone)
    if(!result){
        ctx.body=getRes<string>(5000,'用户不存在')
        return 
    }
    // 2. 验证密码
    if(password!=phone){
        ctx.body=getRes<string>(5000,'密码错误')
        return 
    }
    ctx.body=getRes<UserItem>(2000,result)

})

//curl -X POST -d '{"name":"Jack","age":11,"sex":0,"phone":"15196252581"}' -H 'Content-Type: application/json' http://localhost:9999/user/
// 增加用户
router.post('/', async ctx => {
    const projectReq: UserItem = {
        ...ctx.request.body,
        id: ctx.request.body.phone,
        state: 1,
        head:'',
        cover:'',
    }
    const projects: UserItem[] = readFileAndParse(PROJECT_PATH)
    // 1. 判断该用户是否已存在
    const result = projects.find(item => item.phone == projectReq.phone)
    if (result) {
        ctx.body = getRes<string>(5000, '电话号码重复')
        return
    }
    // 2. 如果不存在插入数据
    const newProjects = [...projects, projectReq]
    try {
        writeFile<UserItem[]>(PROJECT_PATH, newProjects)
        ctx.body = getRes<UserItem>(2000, projectReq.id)
    } catch (error) {
        ctx.body = getRes<UserItem>(5000, '新建用户失败,服务器端错误')
    }
})

//curl -X PUT -d '{"name":"Jack_N","age":11,"sex":0,"phone":"15196252581"}' -H 'Content-Type: application/json' http://localhost:9999/user/TO0DVSMZgHOhQspV
router.put('/:id', async ctx => {
    const projects: UserItem[] = readFileAndParse(PROJECT_PATH)
    const resultIndex = projects.findIndex(item => item.id == ctx.params.id)
    if (resultIndex == -1) {
        ctx.body = getRes<string>(5000, '不存在该项目')
        return
    }
    const newProject = Object.assign({}, projects[resultIndex], {
        ...ctx.request.body
    })
    projects.splice(resultIndex, 1, newProject)
    writeFile<UserItem[]>(PROJECT_PATH, projects)
    ctx.body = getRes<UserItem>(2000, newProject)
})

router.delete('/:id', async ctx => {
    const projects: UserItem[] = readFileAndParse(PROJECT_PATH)
    const resultIndex = projects.findIndex(item => item.id == ctx.params.id)
    if (resultIndex != -1) {
        const newProject = Object.assign({}, projects[resultIndex], {
            state: 0
        })
        projects.splice(resultIndex, 1, newProject)
        writeFile<UserItem[]>(PROJECT_PATH, projects)
        ctx.body = getRes<number>(2000, ctx.params.id)
        return
    } else {
        ctx.body = getRes<string>(5000, '不存在该id')
        return
    }
})

export default router.routes()
