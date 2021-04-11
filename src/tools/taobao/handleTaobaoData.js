#!/usr/bin/env node
const shell=require('shelljs')
const {getList}=require('./taobaoApi')
const dayjs=require('dayjs')
const axios=require('axios')

function getBase64(url){
    return new Promise((resolve)=>{
        axios.get(url, {responseType: 'arraybuffer'}).then(image=>{
            resolve( Buffer.from(image.data).toString('base64'))
        })
    })
}
//  const mediaList=item.rateContent.mainRate.mediaList.map(item=>'https'+item.thumbnail)
function formatList(list){
   return list.map(item=>{
       try {
        let  mediaList=[]
        if(item.rateContent.mainRate.mediaList){
            mediaList=item.rateContent.mainRate.mediaList.map(item=>'https:'+item.thumbnail)
        }
        return{
            date:dayjs(item.rateContent.mainRate.date).format('YYYY/MM/DD HH:mm'),
            num:1,
            userName:item.orderInfo.userName,
            content:item.rateContent.mainRate.content,
            addContent:'',
            mediaList:mediaList,
            variety:item.itemInfo.title,
            reason:'',
            process:'',
            note:''
        }
       } catch (error) {
       console.log("formatList -> error", error)
       return{
        date:dayjs(item.rateContent.mainRate.date).format('YYYY/MM/DD HH:mm'),
        num:1,
        userName:item.orderInfo.userName,
        content:item.rateContent.mainRate.content,
        addContent:'',
        mediaList:[],
        variety:item.itemInfo.title,
        reason:'',
        process:'',
        note:''
    }
           
       }
       
    })
}



// ;(function(){
//     shell.exec(getList(),{silent:true}, async (code, output, stderr) => {
//         if (code == 0) {
//             let list=JSON.parse(output).data.dataSource
//             list=formatList(list)
//             const arr=[]
//             for(let i=0;i<list.length;i++){
//                 let item=list[i]
//                 const requests=item.mediaList.map(item=>getBase64(item))
//                 const imgs=await Promise.all(requests)
//                item.imgs=imgs
//                arr.push(item)
//             }
//             const {handleExcel}=require('./excel')
//             await handleExcel(arr)
//             // 返回流
          
//         }
//     })
// }())




module.exports={
    handleTaobaoData(req,fileName){
        const { cookie, startTime, endTime, rate } = req
        const query={
            current:1,
            pageSize:100,
            startTime,
            endTime,
            rate //-1差评  0中评
        }
        return new Promise((resolve)=>{
            shell.exec(getList(query,cookie),{silent:true}, async (code, output, stderr) => {
                if (code == 0) {
                    let list=[]
                    try {
                        list=JSON.parse(output).data.dataSource
                    } catch (error) {
                        resolve(false)
                    }
                    list=formatList(list)
                    const arr=[]
                    for(let i=0;i<list.length;i++){
                        let item=list[i]
                        const requests=item.mediaList.map(item=>getBase64(item))
                        const imgs=await Promise.all(requests)
                       item.imgs=imgs
                       arr.push(item)
                    }
                    const {handleExcel}=require('./excel')
                    await handleExcel(arr,fileName)
                    // 返回流
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        })
     
    }
}