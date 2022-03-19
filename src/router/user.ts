import * as Router from 'koa-router'

const router = new Router()
import {getRes} from '../tools/index'
import {UserItem} from '../types/userTypes'
import query from '../db/mysql';
import {OkPacket} from '../types/index';

router.get('/', async ctx => {
    // const data = readFileAndParse(PROJECT_PATH)
    const res = await query<UserItem[]>('SELECT * from user')
    ctx.body = getRes<UserItem[]>(2000, res)
})
//curl  http://localhost:9999/user/query?name=&phone
// router.get('/query', async ctx => {
//     // 通过name,sex,age查询
//     const data:UserItem[] = readFileAndParse(PROJECT_PATH)
//     let {name='',phone='',pageNum=1,pageSize=10}=ctx.query
//     let tmp=data
//     if(name){
//         name=name.toLowerCase()
//         tmp=data.filter(item=>  item.name.toLowerCase().indexOf(name) !=-1)
//     }
//     if(phone){
//         tmp=data.filter(item=>item.phone==phone)
//     }
//     tmp=tmp.slice((pageNum-1)*pageSize,pageNum*pageSize)
//     const list=getRes<UserItem[]>(2000, tmp)
//     ctx.body =list
// })

//登录
//curl -X POST -d '{"username":"xiaoming","password":"123456"}' -H 'Content-Type: application/json' http://localhost:22222/user/login

router.post('/login', async ctx => {
    const {username, password} = ctx.request.body
    const res = await query<UserItem[]>('SELECT * from `user` WHERE `username` = ?', [username])
    console.log(res)
    if (res.length === 0) {
        ctx.body = getRes<string>(5000, '用户不存在')
    } else {
        if (res[0].password === password) {
            ctx.body = getRes<UserItem>(2000, {
                ...res[0],
                password: null
            })
        } else {
            ctx.body = getRes<string>(5000, '用户名或密码错误')
        }
    }
})

//curl -X POST -d '{"name":"Jack","age":11,"sex":0,"phone":"15196252581"}' -H 'Content-Type: application/json' http://localhost:9999/user/
// 注册|新增 用户
router.post('/', async ctx => {
    const projectReq: UserItem = {
        ...ctx.request.body
    }
    if (!projectReq.username && !projectReq.password) {
        ctx.body = getRes<string>(5000, '请求参数不完整')
        return
    }
    // 1. 判断该用户是否已存在
    const res = await query<UserItem[]>('SELECT * from `user` WHERE `username`=?', [projectReq.username])
    if (res.length > 0) {
        ctx.body = getRes<string>(5000, '用户已存在')
    } else {
        const insertInfo = await query<OkPacket>('INSERT INTO user SET?', projectReq)
        ctx.body = getRes<number>(2000, insertInfo.insertId)
    }
})

//curl -X PUT -d '{"name":"Jack_N","age":11,"sex":0,"phone":"15196252581"}' -H 'Content-Type: application/json' http://localhost:9999/user/TO0DVSMZgHOhQspV
// router.put('/:id', async ctx => {
//     const projects: UserItem[] = readFileAndParse(PROJECT_PATH)
//     const resultIndex = projects.findIndex(item => item.id == ctx.params.id)
//     if (resultIndex == -1) {
//         ctx.body = getRes<string>(5000, '不存在该项目')
//         return
//     }
//     const newProject = Object.assign({}, projects[resultIndex], {
//         ...ctx.request.body
//     })
//     projects.splice(resultIndex, 1, newProject)
//     writeFile<UserItem[]>(PROJECT_PATH, projects)
//     ctx.body = getRes<UserItem>(2000, newProject)
// })

// router.delete('/:id', async ctx => {
//     const projects: UserItem[] = readFileAndParse(PROJECT_PATH)
//     const resultIndex = projects.findIndex(item => item.id == ctx.params.id)
//     if (resultIndex != -1) {
//         const newProject = Object.assign({}, projects[resultIndex], {
//             state: 0
//         })
//         projects.splice(resultIndex, 1, newProject)
//         writeFile<UserItem[]>(PROJECT_PATH, projects)
//         ctx.body = getRes<number>(2000, ctx.params.id)
//         return
//     } else {
//         ctx.body = getRes<string>(5000, '不存在该id')
//         return
//     }
// })

export default router.routes()
