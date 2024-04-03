import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import { UserItem } from '../types/userTypes'
import query from '../db/mysql'
import { OkPacket } from '../types/index'
import dayjs = require('dayjs')
import { md5 } from '../tools/md5'

//获取用户列表
router.get('/', async (ctx) => {
    // const data = readFileAndParse(PROJECT_PATH)
    const res = await query<UserItem[]>('SELECT * from user')
    ctx.body = getRes<UserItem[]>(2000, res)
})

//登录
//curl -X POST -d '{"username":"xiaoming","password":"123456"}' -H 'Content-Type: application/json' http://localhost:22222/user/login
router.post('/login', async (ctx) => {
    const { username, password } = ctx.request.body
    const res = await query<UserItem[]>(
        'SELECT * from `user` WHERE `username` = ?',
        [username]
    )
    console.log(res)
    if (res.length === 0) {
        ctx.body = getRes<string>(5000, '用户不存在')
    } else {
        if (res[0].password === password) {
            ctx.body = getRes<UserItem>(2000, {
                ...res[0],
                password: null,
            })
        } else {
            ctx.body = getRes<string>(5000, '用户名或密码错误')
        }
    }
})

//修改用户信息
router.post('/update', async (ctx) => {
    const { id } = ctx.request.body
    const res = await query<UserItem[]>('SELECT * from `user` WHERE `id` = ?', [
        id,
    ])
    if (res.length === 0) {
        ctx.body = getRes<string>(5000, '用户不存在')
    } else {
        // 记录修改之前的值
        const {
            username: oldUserName,
            password: oldPassword,
            avatar: oldAvatar,
            cover: oldCover,
            filter: oldFilter,
        } = res[0]
        // 如果没有传对应的key过来，值为修改之前的值
        let {
            username = oldUserName,
            password = oldPassword,
            avatar = oldAvatar,
            cover = oldCover,
            filter = oldFilter,
        } = ctx.request.body
        if (filter) {
            console.log('filter', filter)
            let tmp = filter.split(',')
            let old = oldFilter.split(',')
            let newFilter = tmp.concat(old)
            filter = [...new Set(newFilter)].join(',')
            console.log('new filter', filter)
        }
        // 修改用户信息
        const updateRes = await query<OkPacket>(
            'UPDATE user SET username=?,password=?,avatar=?,cover=?,filter=? WHERE id=? ',
            [username, password, avatar, cover, filter, id]
        )
        ctx.body = getRes<UserItem>(2000, {
            id,
            username,
            avatar,
            cover,
            filter,
        })
    }
})

//curl -X POST -d '{"name":"Jack","age":11,"sex":0,"phone":"15196252581"}' -H 'Content-Type: application/json' http://localhost:9999/user/
// 注册|新增 用户
router.post('/', async (ctx) => {
    const projectReq: UserItem = {
        ...ctx.request.body,
    }
    console.log('😃😃', projectReq)
    if (!projectReq.username && !projectReq.password) {
        ctx.body = getRes<string>(5000, '请求参数不完整')
        return
    }
    // 1. 判断该用户是否已存在
    const res = await query<UserItem[]>(
        'SELECT * from `user` WHERE `username`=?',
        [projectReq.username]
    )
    if (res.length > 0) {
        ctx.body = getRes<string>(5000, '用户已存在')
    } else {
        const insertInfo = await query<OkPacket>(
            'INSERT INTO user SET?',
            projectReq
        )
        ctx.body = getRes<number>(2000, insertInfo.insertId)
    }
})

router.post('/check', async (ctx) => {
    const { password } = ctx.request.body
    const key = md5(dayjs().format('YYYYMMDD'))
    if(password===key){
        ctx.body = getRes<number>(2000,'success')
    }else{
        ctx.body = getRes<number>(5000,'error')
    }
    
})

export default router.routes()
