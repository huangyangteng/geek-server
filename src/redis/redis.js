const { createClient } = require('redis')
let client=createClient({
    url: 'redis://:313265@redis@43.136.216.240:6379',
})
client.connect()
const WORK_SET = 'workSet'
const WORD_LIST = 'workList'
const redisClient = client



async function getWorkList() {
    let list = await client.lRange(WORD_LIST, 0, -1)
    console.log(list)
    return list
}
setTimeout(()=>{
    getWorkList()
},1000)