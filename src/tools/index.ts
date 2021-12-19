import dayjs = require('dayjs');
import * as fs from 'fs'
import * as shell from 'shelljs'
import { RequestRes } from '../types/index';
/**
 *
 * @param code 2000|5000
 * @param data
 */
export function getRes<T>(code: number, data: T[] | T | string) {
    const desc = code == 2000 ? 'success' : 'error'

    return JSON.stringify({
        code,
        desc,
        data
    })
}

export function readFileAndParse(path: string) {
    return JSON.parse(fs.readFileSync(path).toString())
}
export function writeFile<T>(path: string, data: T) {
    fs.writeFileSync(path, JSON.stringify(data))
}
/**
 * 生成随机id
 * @param {*} length
 * @param {*} chars
 */
export function uuid(length?: number, chars?: string) {
    chars =
        chars ||
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    length = length || 16
    let result = ''
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)]
    return result
}
/**
 * 判断是否是文件夹
 * @param path
 */
export function isDir(path: string) {
    return fs.lstatSync(path).isDirectory()
}
/**
 * 遍历目录下面的所有文件
 * @param dir
 */
export function walkDir(dir: string) {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach(function(file) {
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

export function getExt(filename: string) {
    return filename
        .split('.')
        .pop()
        .toLowerCase()
}

export const  request=async(api:string):Promise<RequestRes>=>{
    return new Promise((resolve)=>{
        shell.exec(api,{silent:true},(code, output, stderr)=>{

            if(code===0){//请求成功
                try{
                    resolve({
                        code,
                        data:JSON.parse(output)
                    })
                }catch(error){
                    resolve({
                        code,
                        data:'success'
                    })
                }
               
            }else{
                resolve( {
                    code,
                    data:stderr
                })
            }
        })
    })
    

}
export function sleep(ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export  function toHump(name:string) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
export function objToHump<T>(obj: Record<string, any>){
    let newObj: Record<string, any>={}
    for(let key in obj){
        newObj[toHump(key)]=obj[key]    
    }
    return newObj
}
export function arrayToHump<T>(arr:T[]){
    return arr.map(item=>objToHump(item)) as T[]
}
export function formatTime(time:string,formatType='YYYY-MM-DD hh:mm:ss'){
    return dayjs(time).format(formatType)
}