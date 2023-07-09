import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import registerRouter from './router/index'
import * as path from 'path'
const cors = require('koa2-cors');

//启动定时任务 
import './job/index'

const app = new Koa()
app.use(
    koaBody({
        multipart: true, //支持文件上传
        formidable: {
            uploadDir: path.join(__dirname,'..', 'gk-files'),
            keepExtensions: true,
            maxFieldsSize: 200 * 1024 * 1024,
        },
        formLimit:"10mb",
        jsonLimit:"10mb"
    })
)
// 设置跨域
app.use(cors())
app.use(async (ctx, next) => {
    // Log the request to the console
    console.log('Url:', ctx.url)
    // Pass the request to the next middleware function
    await next()
})

app.use(registerRouter)

const PORT=22222
app.listen(PORT,'0.0.0.0')

console.log('Server running on port  http://10.4.6.175:'+PORT+'  ')
