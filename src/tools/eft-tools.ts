import axios from 'axios'
// import iconv from 'iconv-lite'
const iconv = require('iconv-lite')
export const getEftInfo =  (code: string) => {
    let ext=code.slice(3)
    return  new Promise((resolve)=>{
        axios({
            url: `https://hq.stock.sohu.com/cn/${ext}/cn_${code}-1.html?_=1672823981683`,
            responseType: 'stream',
        }).then((res) => {
            //此时的res.data 则为stream
            let chunks:any = []
            res.data.on('data', (chunk:any) => {
                chunks.push(chunk)
            })
            res.data.on('end', () => {
                let buffer = Buffer.concat(chunks)
                //通过iconv来进行转化。
                let str = iconv.decode(buffer, 'gbk')
                str=str.replace(`fortune_hq(`,'').replace(`);`,'')
                let json = eval("(" + str + ")");
                resolve(json['price_A1'])
            })
        })
    })
}

export const getEtfPrice=async (code:string)=>{
    const res:any=await getEftInfo(code)
    return res[2]
}