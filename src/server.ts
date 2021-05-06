import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import registerRouter from './router/index'
import * as path from 'path'
const cors = require('koa2-cors');

const app = new Koa()
app.use(
    koaBody({
        multipart: true, //支持文件上传
        formidable: {
            uploadDir: path.join(__dirname, 'data/upload'),
            keepExtensions: true,
            maxFieldsSize: 2 * 1024 * 1024
        }
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

app.listen(9999)

console.log('Server running on port  http://localhost:9999  ')
