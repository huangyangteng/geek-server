import * as cheerio from 'cheerio'
import { request } from '.';
import { writeFile } from './index';
import * as path from 'path';
import * as  fs from 'fs';


function getPages($:any) {
    const BASE = 'https://www.acfun.cn'
    let list:any=[]
    $('.part li').each(function (index:number, item:any) {
        if (index == 0) {
            console.log(
                index,
                item.attribs['data-id'],
                item.attribs['data-href'],
                item.attribs['title']
            )
        }
        list.push({
            page: index + 1,
            part: item.attribs['title'],
            id: item.attribs['data-id'],
            cid: item.attribs['data-id'],
            link: BASE + item.attribs['data-href'],
            isAcfun:true
        })
    })
    return list
}

function getVideoInfo(str:string) {
    //[version:'',adaptationSet:[{id:0,duration:2000,representation:[{id:1,url:''},{id:2,url:''}]}]]
    var reg = /ksplayJson":"(\{.*\})","ksPlayJsonHevc/gim
    let res = reg.exec(str)
    // console.log( res[1][0])
    // console.log(res.length,JSON.parse(JSON.parse(`"${res[1]}"`)) )
    const videoInfo=JSON.parse(JSON.parse(`"${res[1]}"`))
    return videoInfo.adaptationSet[0].representation[0].url
}
function getSpareSrc(str:string){
     //[version:'',adaptationSet:[{id:0,duration:2000,representation:[{id:1,url:''},{id:2,url:''}]}]]
     var reg = /ksplayJson":"(\{.*\})","ksPlayJsonHevc/gim
     let res = reg.exec(str)
     // console.log( res[1][0])
     // console.log(res.length,JSON.parse(JSON.parse(`"${res[1]}"`)) )
     const videoInfo=JSON.parse(JSON.parse(`"${res[1]}"`))
     return videoInfo.adaptationSet[0].representation
}
function getTitle($:any){
    return $('h1.title').text()
}
function getCover(str:string){
    let reg=/coverUrl":\s*"(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])"/gi
    return reg.exec(str)[1]
}

export const getAcVideoInfo=async(link:string,onlySrc:boolean|undefined)=>{
    const api=`
        curl ${link}
    `
    const res=await request(api)
    const FILES_PATH = path.join(__dirname, '../data/test.json')
    fs.writeFileSync(FILES_PATH, res.data)
    const $ = cheerio.load(res.data)
    const str=$.html()
    return {
        title:getTitle($),
        pic:getCover(str),
        pages:getPages($),
        src:getVideoInfo(str),
        spareSrc:getSpareSrc(str)
    }

}