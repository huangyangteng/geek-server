import * as  fs from 'fs'
import { uuid } from './index';
const  ffmpeg = require('fluent-ffmpeg');

export function getOutput(str:string){
    const filename=str.split('/').pop()
    const i=str.indexOf(filename)
    return  str.slice(0,i)+'p_'+filename
}

export function getCodec(path:string){
    return new Promise((resolve)=>{
        ffmpeg.ffprobe(path,function(err:any, metadata:any) {
            var audioCodec = null;
            var videoCodec = null;
            metadata.streams.forEach(function(stream:any){
                if (stream.codec_type === "video")
                    videoCodec = stream.codec_name;
                else if (stream.codec_type === "audio")
                    audioCodec = stream.codec_name;
            });
            resolve({
                video:videoCodec,
                audio:audioCodec
            })
        });
    })
   
}

/**
 * 遍历目录下面的所有文件
 * @param dir
 */
export function walkDir(dir: string) {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach(function(file:string) {
        file = dir + '/' + file
        const stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walkDir(file))
        } else {
            /* Is a file */
            results.push(file)
        }
    })
    return results
}
function filterDir(list:String[]) {
    return list.filter(item => !item.startsWith('.'))
}
export function generateResource(dir='/Users/h/Desktop/learning',targetFile:string){
    const columns = filterDir(fs.readdirSync(dir))
    const result = columns.map(column => {
        const columnDir = dir + '/' + column
        const articles = filterDir(fs.readdirSync(columnDir))
        const formatedArticles = articles.map(item => {
            const list = walkDir(columnDir + '/' + item)
            return {
                id:hashCode(item as string),//
                title: item,
                list: list
            }
        })
        return {
            id:uuid(),
            type: column,
            list: formatedArticles
        }
    })
    fs.writeFileSync(targetFile, JSON.stringify(result))
}
export function hashCode(str:string) {
    const hash= str
        .split('')
        .reduce(
            (prevHash, currVal) =>
                ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
            0
        )
    return Math.abs(hash)
}