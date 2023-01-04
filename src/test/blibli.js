const axios=require('axios')

const getVideoUrl=async(aid)=>{
    const res=await axios.get(`https://api.injahow.cn/bparse/?av=${aid}&p=1&format=mp4&otype=json`)
    console.log('res',res.data)
}
;( async()=>{
    console.log('hahaha')
    await getVideoUrl(760268494)
})()