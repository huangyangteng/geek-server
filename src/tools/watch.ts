import * as  fs from 'fs'
import { uuid } from './index';
/**
 * 遍历目录下面的所有文件
 * @param dir
 */
function walkDir(dir: string) {
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
                id:uuid(),
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