const path = require('path')
const fs = require('fs')
 function getExt(filename) {
    if (typeof filename == 'string') {
        return filename
            .split('.')
            .pop()
            .toLowerCase()
    } else {
        throw new Error('filename must be a string type')
    }
}
// 首字母大写
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// 中划线、下划线转为驼峰命名
function toCamelCase(str) {
    return str.replace(/[-_](.)/g, function(match, group1) {
        return group1.toUpperCase()
    })
}

// 删除文件夹及下面的所有文件
function removeDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return
    }
    const files = fs.readdirSync(dirPath)
    for (const file of files) {
        const filePath = path.join(dirPath, file)
        if (fs.statSync(filePath).isDirectory()) {
            removeDirSync(filePath)
        } else {
            fs.unlinkSync(filePath)
        }
    }
    fs.rmdirSync(dirPath)
}





function createNodeFile(path,name){
    console.log('🏀🏀🏀',path,name)
    let UpperName=capitalizeFirstLetter(name)
    const content=`
import * as Router from 'koa-router'
const router = new Router()
import { getRes } from '../tools/index'
import query from '../db/mysql'
import { OkPacket } from '../types/index'

export interface ${UpperName}Item {
    id?: number
}
/**
 * 获取前端发送数据
 * url: name=ming 🏀🏀🏀 ctx.query
 * url:/user/ming 🏀🏀🏀 ctx.params
 * header: ctx.request.header
 * body:  ctx.request.body  ctx.request.files
 */

// 查询
router.get('/', async (ctx) => {
    let res = await query<${UpperName}Item[]>('SELECT * from \`${name}\`', [])
    ctx.body = getRes<${UpperName}Item[]>(2000, res)
})

// 添加
router.post('/', async (ctx) => {
    let req = {
        ...ctx.request.body,
    }
    const res=await query<OkPacket>('INSERT INTO \`${name}\` SET?', req)
    ctx.body = getRes<number>(2000, res.insertId)
})

// 修改
router.put('/', async (ctx) => {
    let { id } = ctx.request.body
    if (!id) {
        ctx.body = getRes<string>(5001, '参数不完整')
        return
    }
    // 先查询原始数据
    const res = await query<${UpperName}Item[]>('SELECT * from \`${name}\` WHERE \`id\`=? ', [
        id,
    ])
    let req = {
        ...res[0],
        ...ctx.request.body
    }
    await query<OkPacket>('UPDATE ${name} SET name=?,name2=? WHERE id=?', [
        req.name,
        req.name2,
        String(id),
    ])
    ctx.body=getRes<${UpperName}Item>(2000,req)
})

export default router.routes()
        
`
    fs.writeFileSync(path+'.ts', content)
    // 新建文档
    let docContent=`
### 查询
GET http://localhost:22222/${name} HTTP/1.1


### 增加
POST http://localhost:22222/${name}/ HTTP/1.1
content-type:application/json

{"name":"RESTAPI"}

### 修改
PUT http://localhost:22222/${name}/ HTTP/1.1
content-type:application/json

{"id":5}
    
    
`
    fs.writeFileSync(`/Users/h/hhh-project/self-apps/geek-server/src/api-doc/${name}.http`, docContent)

    const printContent=`
import ${UpperName}Router from './${name}'

apiRouter.use('/${name}',${UpperName}Router)
`
    console.log(printContent)
}


function runCreate(item) {
    const { path:abPath, files,overwrite,ignore } = item
    if(!fs.existsSync((abPath))){//目录不存在，新建
        fs.mkdirSync(abPath)

    }
    // 如果传递了overwrite,先删除
    if(overwrite){
        removeDirSync(abPath)
    }
    if(ignore){
        return
    }



    //目录不存在，新建目录
    if (!fs.existsSync(abPath)) {
        console.log('🍎🍎🍎🍎','目录不存在，新建目录',abPath)
        // 新建目录
        fs.mkdirSync(abPath)
    }

    //    遍历文件，新建文件
    for(let i=0;i<files.length;i++){
      let {name,type}=files[i]
      let filePath=abPath+'/'+name
         //文件不存在时，才新建文件
      if(!fs.existsSync(filePath)){
        if(type==='route'){
            // 新建nodejs接口文件
            createNodeFile(filePath,name)
          }
      }
    

    }


}


//新建文件
//判断文件是否存在，如果存在，不管，不存在，新建
//判断目录是否存在，存在，不管，不存在，新建
;(function() {
    const [nodeEnv, dir, ...args] = process.argv
    try {
        // 读取配置文件
        const data = fs.readFileSync(path.resolve(__dirname, './create-file.json'), 'utf8')

        const listConfig = JSON.parse(data)
        for(let i=0;i<listConfig.length;i++){
            runCreate(listConfig[i])
        }


    } catch (error) {
        console.log('error', error)
    }


}())