import * as path from 'path'
import * as fs from 'fs'
export function writeToTestFile(data:any){
     const FILES_PATH = path.join(__dirname, '../data/test.json')
    fs.writeFileSync(FILES_PATH, data)
}