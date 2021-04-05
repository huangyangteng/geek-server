import * as Router from 'koa-router'
const router = new Router()
import * as path from 'path'
import { getRes, uuid, readFileAndParse, writeFile } from '../tools/index'
import { ProjectItemType } from '../types/projectType'

const PROJECT_PATH = path.join(__dirname, '../data/project.json')

router.get('/', async ctx => {
    const data = readFileAndParse(PROJECT_PATH)
    ctx.body = getRes<ProjectItemType[]>(2000, data)
})

router.post('/', async ctx => {
    const projectReq: ProjectItemType = {
        ...ctx.request.body,
        id: uuid(),
        state: 1
    }
    const projects: ProjectItemType[] = readFileAndParse(PROJECT_PATH)
    // 1. 判断该项目是否已存在
    const result = projects.find(item => item.name == projectReq.name)
    if (result) {
        ctx.body = getRes<string>(5000, '已存在该项目')
        return
    }
    // 2. 如果不存在插入数据
    const newProjects = [...projects, projectReq]
    try {
        writeFile<ProjectItemType[]>(PROJECT_PATH, newProjects)
        ctx.body = getRes<ProjectItemType>(2000, projectReq.id)
    } catch (error) {
        ctx.body = getRes<ProjectItemType>(5000, '新建项目失败,服务器端错误')
    }
})
router.put('/:id', async ctx => {
    const projects: ProjectItemType[] = readFileAndParse(PROJECT_PATH)
    const resultIndex = projects.findIndex(item => item.id == ctx.params.id)
    if (resultIndex == -1) {
        ctx.body = getRes<string>(5000, '不存在该项目')
        return
    }
    const newProject = Object.assign({}, projects[resultIndex], {
        ...ctx.request.body
    })
    projects.splice(resultIndex, 1, newProject)
    writeFile<ProjectItemType[]>(PROJECT_PATH, projects)
    ctx.body = getRes<ProjectItemType>(2000, newProject)
})

router.delete('/:id', async ctx => {
    const projects: ProjectItemType[] = readFileAndParse(PROJECT_PATH)
    const resultIndex = projects.findIndex(item => item.id == ctx.params.id)
    if (resultIndex != -1) {
        const newProject = Object.assign({}, projects[resultIndex], {
            state: 0
        })
        projects.splice(resultIndex, 1, newProject)
        writeFile<ProjectItemType[]>(PROJECT_PATH, projects)
        ctx.body = getRes<number>(2000, ctx.params.id)
        return
    } else {
        ctx.body = getRes<string>(5000, '不存在该项目id')
        return
    }
})

export default router.routes()
