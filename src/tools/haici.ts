import { request } from './index';
import * as cheerio from 'cheerio'


export const fetchDict=async(keyword:string)=>{
    const req=`
    curl 'http://dict.cn/${keyword}' \
    -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
    -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
    -H 'Connection: keep-alive' \
    -H 'Cookie: __utmz=7761447.1652847218.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); Hm_lvt_c02099862d294e963ee04d8f8a6f204f=1656379273,1656464593,1656514441,1656554335; __utma=7761447.580185469.1652847218.1656514442.1656554335.13; __utmc=7761447; __utmt=1; dicthe=YcJx4SX5y40x9A4yziy4Tc7B4A7Sy4nhtC4iQ5A4SYaz4IOaz4k9tC4PgSB4Sh8C4rJdz494GB4g8az4cY4A4TWqB4Fobz4EBkC4%2Fafter%2Fbid%2Firritate%2Fcarry%2Fparity; Hm_lpvt_c02099862d294e963ee04d8f8a6f204f=1656554409; __utmb=7761447.4.10.1656554335' \
    -H 'Referer: http://dict.cn/after' \
    -H 'Upgrade-Insecure-Requests: 1' \
    -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --compressed \
    --insecure
    `
    const res=await request(req)
    if(res.code===0){
        return res.data
    }else{
        return null
    }
}



export function parseDict(html:string) {
    const $ = cheerio.load(html)
	// 提取数字
    const extractNumber = (str:string) => {
        try {
            return str.match(/\d/)[0]
        } catch (error) {
            return 0
        }
    }
	// 去除中文
	const removeChinese=(str:string)=>{
		const reg =/[\u4e00-\u9fa5]/g;
		return str.replace(reg,'')
	}
    // 去除\n\n
    const replaceLF = (str:string) => {
        return str.replace(/\t/g, '').replace(/[\n]/g, '')
    }
    // 获取level
    const getLevel = () => {
        const stars = $('.word-cont').find('a')
        // @ts-ignore
        return extractNumber(stars['1'].attribs.class)
    }
	// 获取单词释义
    const getMeaning = () => {
        let arr:any = []
        $('.dict-basic-ul li').each(function (index) {
            arr.push(replaceLF($(this).text()))
        })
        return arr
    }
    const getMeaningTotal=()=>{
		let node=$('#dict-chart-basic')
		let obj=JSON.parse(unescape(node[0].attribs.data))
		let list=[]
		for(let key in obj){
			list.push(obj[key])
		}
		return list
	}
	// 获取例句
    const getExamples = () => {
        const layout = $('.layout.sort')
        let arr:any = []
        layout.children().each(function (index, item) {
            // console.log(index,item.name)
            if (item.name === 'div') {
                let content = replaceLF($(this).text())
                if (content) {
                    arr.push(content)
                }
            }
            if (item.name === 'ol') {
                let list = replaceLF($(this).text())
                    .split('。')
                    .filter((item) => item)
                arr.push(...list)
            }
        })
        return arr
    }
    const getUsage=()=>{
		let arr:any[]=[]
		let child=$('.layout.ess').children()
		child.each(function(){
            //@ts-ignore
            let obj={title:'',list:[]}
			if($(this)[0].name==='span'){
                arr.push({type:'title',content:replaceLF($(this).text())})
			}
            //@ts-ignore
			if($(this)[0].name==='ol'){
				$(this).children().each(function(){
                    arr.push({type:'usage',content:replaceLF($(this).text())})
				})
			}
			
		})
        return arr
	
	}

	// 最终返回结果
	let examples=getExamples()
	// let question:any=[]
	// examples.forEach((item:any)=>{
	// 	if(!item.includes('用作')){
	// 		let list=item.split('.')
	// 		question.push(list[0])
	// 	}
	// })
    let obj = {
        level: getLevel(),
        meaning: getMeaning(),
        meaningTotal:getMeaningTotal(),
        examples: examples,
        usages:getUsage()
    }
    // console.log(obj)
	return obj
}
