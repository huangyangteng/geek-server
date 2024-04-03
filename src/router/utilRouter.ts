import * as Router from 'koa-router'
import {
    walkDir,
    getExt,
    uuid,
    writeFile,
    readFileAndParse,
    request,
} from '../tools/index'
const router = new Router()
import * as fs from 'fs'
import * as send from 'koa-send'
import * as path from 'path'

//@ts-ignore
import { handleTaobaoData } from '../tools/taobao/handleTaobaoData.js'
import dayjs = require('dayjs')
import { createTextChangeRange, createTextSpan } from 'typescript'
import { fetchDict, parseDict } from '../tools/haici'
import { getFundInfo } from '../tools/invest'
import { getBBVideoSrc } from '../tools/blibli'
import { getRes } from '../tools/index';
import {generateReporter} from '../tools/reporter/index' 
function getName(path: string) {
    return path.split('/').pop()
}
interface VideoItem {
    id: string
    name: string
    src: string
}
interface WatchRes {
    title: string
    list: VideoItem[]
}
interface ListItem {
    id: string
    name: string
    age: number
}
interface File {
    id: string
    name: string
    path: string
    date: string
}
router.get('/bdy(.*)', async (ctx) => {
    ctx.body = JSON.stringify({ code: 'ok' })
})

router.get('/invest', async (ctx) => {
    const res = await getFundInfo()
    ctx.body = getRes<any>(2000, res)
})

// 上传
const FILES_PATH = path.join(__dirname, '../data/files.json')
router.post('/upload', async (ctx) => {
    const { path, name } = ctx.request.files.file
    const filePath = 'gk-files' + '/' + path.split('/').pop()
    const files: File[] = readFileAndParse(FILES_PATH)
    writeFile<File[]>(FILES_PATH, [
        {
            id: uuid(),
            name,
            path: filePath,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        ...files,
    ])
    ctx.body = getRes<any>(2000, { data: 'ok' })
})
// 获取上传的文件列表
router.get('/files', async (ctx) => {
    let files: File[] = readFileAndParse(FILES_PATH)
    let { start, end } = ctx.query
    // start 与end之间
    if (start && end) {
        start = dayjs(start).subtract(1, 'ms')
        end = dayjs(end).add(1, 'ms')
        files = files.filter((item) => {
            return (
                dayjs(item.date).isAfter(start) &&
                dayjs(item.date).isBefore(end)
            )
        })
    }
    ctx.body = getRes<any>(2000, files)
})

// 测试接口
router.all('/test', async (ctx) => {
    console.log(ctx.request.files)
    ctx.body = getRes<any>(2000, {
        method: ctx.request.method,
        url: ctx.request.url,
        header: ctx.request.header,
        params: ctx.query, //name=xxx&age=xxx
        // params:ctx.params
        body: ctx.request.body,
        files: ctx.request.files,
    })
})

//https://www.npmjs.com/package/koa-send
router.all('/taobao', async (ctx) => {
    const { startTime, endTime, rate } = ctx.request.body
    const type = rate == 0 ? '中评' : '差评'

    const fileName = `${startTime}-${endTime}${type}_${uuid()}.xlsx`
    // 生成文件
    const success = await handleTaobaoData(ctx.request.body, fileName)
    console.log('success', success)
    ctx.body = 'ok'
    if (success) {
        ctx.body = getRes<any>(2000, {
            file: fileName,
        })
    } else {
        ctx.body = getRes<string>(5000, '生成excel失败')
    }
})
router.get('/download', async (ctx) => {
    const fileName = ctx.query.file
    const path = 'excels/' + fileName
    ctx.attachment(path)
    await send(ctx, path)
})

router.post('/watch', async (ctx) => {
    const { path } = ctx.request.body
    if (!fs.existsSync(path)) {
        ctx.body = getRes<string>(3000, '路径不存在')
        return
    }
    const list = walkDir(path)
    const videoList: VideoItem[] = list
        .filter((item) => getExt(item) == 'mp4')
        .map((item) => {
            return {
                id: uuid(),
                name: getName(item),
                src: item,
            }
        })

    ctx.body = getRes<WatchRes>(2000, {
        title: getName(path),
        list: videoList,
    })
})

router.get('/list', async (ctx) => {
    const { id } = ctx.request.query
    let list = [
        { id: 0, name: 'xiaoming', age: 11 },
        { id: 1, name: 'xiaohong', age: 23 },
        { id: 2, name: 'Jack', age: 11 },
        { id: 3, name: 'Peter', age: 23 },
        { id: 3, name: 'Mouse', age: 23 },
    ]
    if (id && id != -1) {
        list = list.filter((item) => item.id == id)
    }
    ctx.body = list
})

router.get('/see', async (ctx) => {
    const { key } = ctx.request.query
    console.log(key)
    ctx.body = getRes<string>(2000, key)
})

// 解析海词词典
router.get('/translate', async (ctx) => {
    const { word } = ctx.request.query
    console.log(word)
    const doc = await fetchDict(word)
    const res = parseDict(doc)
    ctx.body = getRes<any>(2000, res)
})
router.get('/bb-test', async (ctx) => {
    const src = await getBBVideoSrc(ctx.request.query.link)
    console.log('🍎🍎🍎🍎', src)
    ctx.body = getRes(200, src)
})

//----------------查询一下本周工作时长
const getAttendance = (cookie: string) => {
    const api = `
    curl 'http://mjkq.ebupt.net/data/getAttendanceData?search=this_week&_search=false&nd=1680248761818&rows=20&page=1&sidx=KQDate&sord=desc' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: ${cookie}' \
  -H 'Pragma: no-cache' \
  -H 'Referer: http://mjkq.ebupt.net/view/staff/attendance_data.html' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  --compressed \
  --insecure
    `
    return request(api)
}
function formatCookie(cookieStr: string) {
    // 使用正则表达式查找所有 Set-Cookie 头
    var cookies = cookieStr.match(/Set-Cookie:\s*([^;]*)/g)

    // 遍历所有 Set-Cookie 头，将它们拼接成一个字符串
    var formattedCookie = ''
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].replace('Set-Cookie:', '').trim()
        var cookieParts = cookie.split(';')
        for (var j = 0; j < cookieParts.length; j++) {
            var cookiePart = cookieParts[j].trim()
            if (cookiePart.toLowerCase().startsWith('path=')) {
                continue
            }
            if (formattedCookie !== '') {
                formattedCookie += ';'
            }
            formattedCookie += cookiePart
        }
    }

    // 返回格式化后的Cookie字符串
    return formattedCookie
}
const getCookie = (name: string, pass: string) => {
    const url = `
    curl -i  'http://mjkq.ebupt.net/site/login' \
    -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
    -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'Cache-Control: no-cache' \
    -H 'Connection: keep-alive' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Cookie: PHPSESSID=e6dut0ksa7ecvne2mkf6817143' \
    -H 'Origin: http://mjkq.ebupt.net' \
    -H 'Pragma: no-cache' \
    -H 'Referer: http://mjkq.ebupt.net/site/login' \
    -H 'Upgrade-Insecure-Requests: 1' \
    -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
    --data-raw 'username=${name}&password=${pass}' \
    --compressed \
    --insecure  | grep Set-Cookie
    `
    return new Promise((resolve) => {
        request(url).then((res) => {
            resolve(formatCookie(res.data))
        })
    })
}
router.get('/checking-in', async (ctx) => {
    const { name, pass } = ctx.request.query
    const cookie = (await getCookie(name, pass)) as string
    console.log('cookie', cookie)
    const res = await getAttendance(cookie)
    let data = eval('(' + res.data + ')')
    console.log('data', JSON.stringify(data))
    // 定义一个变量用于存储求和结果
    let sum = 0

    // 遍历rows数组，累加每一行的第5个数
    for (let i = 0; i < data.rows.length; i++) {
        sum += data.rows[i].cell[4]
    }
    let surplus = Number((40 - sum).toFixed(2))
    console.log('surplus', surplus)
    const now = new Date()
    const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        10,
        0,
        0
    )
    const end = new Date(start.getTime() + surplus * 60 * 60 * 1000)

    ctx.body = getRes<any>(200, {
        总工时: sum,
        还差: surplus < 0 ? 0 : surplus,
        假如今天9点上班: `下班时间：${end.toLocaleTimeString()}`,
        rows: data.rows,
    })
})

function cancelAttensiton(id:number){
    const url=`
    curl 'https://api.bilibili.com/x/relation/modify' \
    -H 'authority: api.bilibili.com' \
    -H 'accept: application/json, text/plain, */*' \
    -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/x-www-form-urlencoded' \
    -H 'cookie: LIVE_BUVID=AUTO5716251022063532; i-wanna-go-back=-1; buvid4=3AA193EA-524C-3694-1574-C90B1D1BC55D44557-022012417-5fyojWqsNF8CuUz2JJRNLg%3D%3D; CURRENT_BLACKGAP=0; buvid_fp_plain=undefined; is-2022-channel=1; fingerprint3=e8b721502d727571d89fa2f5e00ae94b; blackside_state=0; buvid3=AD636381-A951-4D6F-BCD9-70814383945E167610infoc; hit-dyn-v2=1; b_nut=100; _uuid=57C964CE-EF93-A2FF-510103-C81EB8C77C4890314infoc; DedeUserID=33442297; DedeUserID__ckMd5=a2e4379307338932; CURRENT_QUALITY=112; rpdid=0zbfAHZkTj|6k1iWEHO|3C6|3w1OViFo; fingerprint=41b7b2a087ecc779abbb5f5e15a6582f; buvid_fp=41b7b2a087ecc779abbb5f5e15a6582f; nostalgia_conf=-1; header_theme_version=CLOSE; home_feed_column=5; CURRENT_FNVAL=4048; b_ut=5; CURRENT_PID=ec0139f0-ceb1-11ed-ab2e-cf5c4915caab; PVID=1; hit-new-style-dyn=1; b_lsid=1014DA139_18759DBCF50; SESSDATA=d0abb785%2C1696391797%2C6e860%2A42; bili_jct=b6c31f38bd0d3f684929ebb47e93f65c; sid=63pmmadr; bp_video_offset_33442297=781688008063582200' \
    -H 'origin: https://space.bilibili.com' \
    -H 'pragma: no-cache' \
    -H 'referer: https://space.bilibili.com/33442297/fans/follow' \
    -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: empty' \
    -H 'sec-fetch-mode: cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
    --data 'fid=${id}&act=2&re_src=11&spmid=333.999.0.0&extend_content=%7B%22entity%22%3A%22user%22%2C%22entity_id%22%3A250623979%2C%22fp%22%3A%220%5Cu00011920%2C%2C1080%5Cu0001MacIntel%5Cu000116%5Cu00018%5Cu000124%5Cu00011%5Cu0001zh-CN%5Cu00011%5Cu00010%2C%2C0%2C%2C0%5Cu0001Mozilla%2F5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F111.0.0.0%20Safari%2F537.36%22%7D&jsonp=jsonp&csrf=b6c31f38bd0d3f684929ebb47e93f65c' \
    --compressed
    
    `
    return new Promise((resolve) => {
        request(url).then((res) => {
           resolve(res)
        })
    })

}
router.get('/cancel-attention',async (ctx) => {
    let list=ctx.request.query.ids.split(',')
    console.log("list", list,list.length)
    for(let i=0;i<list.length;i++){
       const res= await cancelAttensiton(Number(list[i]))
       console.log(i,res)
    }
    ctx.body=getRes<any>(2000,'取消关注成功')
})


router.post('/reporter',async ctx=>{
    const rule=ctx.request.body
    const res=await generateReporter(rule)
    ctx.body=res
})

export default router.routes()
