import { request } from '.'
import { TITLE_REG, LINK_REG, WX_META_REG } from './reg';
import { writeToTestFile } from './debug';

export const handleInfoLink = async (info: string) => {
    let list = info.match(LINK_REG)
    if(!list)return info
    if (list.length > 0) {
        let map: Record<string, string> = {}
        for (let i = 0; i < list.length; i++) {
            let link = list[i]
            let title
            try {
                title = await getTitleFromLink(link)
            } catch (error) {
                title=(new URL(link)).hostname
            }
            
            map[link] = title
        }
        return info.replace(LINK_REG,(val)=>{
            return  `<a href="${val}" target="_blank">${map[val]}</a>`
        })
    } else {
        return info
    }
}
export const getTitleFromLink = async (link: string) => {
    let reqUrl = `curl ${link}`
    if (link.includes('bilibili')) {
        reqUrl = `
        curl '${link}' \
        -H 'authority: www.bilibili.com' \
        -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
        -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' \
        -H 'cache-control: no-cache' \
        -H $'cookie: buvid3=0C3EE897-5A81-4282-AA7D-EBB2A6401D02138365infoc;_uuid=0162DE57-DB2D-0868-701A-F0A488066BB245841infoc; video_page_version=v_old_home; fingerprint_s=961b040edc490dfbe731f88a18cd1845; i-wanna-go-back=-1; buvid4=3AA193EA-524C-3694-1574-C90B1D1BC55D44557-022012417-5fyojWqsNF8CuUz2JJRNLg%3D%3D; blackside_state=1; nostalgia_conf=-1; CURRENT_BLACKGAP=0; buvid_fp_plain=undefined; is-2022-channel=1; b_ut=5; SESSDATA=3fab928c%2C1665195790%2C8afb7%2A41; bili_jct=4730ed50b07450093c3b58c4a7160484; DedeUserID=33442297; DedeUserID__ckMd5=a2e4379307338932; sid=ik91i9nb; buvid_fp=bbad3365aa1cc720a64ceaee2e1809f5; fingerprint3=e8b721502d727571d89fa2f5e00ae94b; fingerprint=49be141aa93dbeed63e1e30ed7a52cfa; CURRENT_QUALITY=0; bp_video_offset_33442297=651086788337598500; CURRENT_FNVAL=4048; PVID=2; b_lsid=E1DB3F6E_180552C2943; innersign=1' \
        -H 'pragma: no-cache' \
        -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"' \
        -H 'sec-ch-ua-mobile: ?0' \
        -H 'sec-ch-ua-platform: "macOS"' \
        -H 'sec-fetch-dest: document' \
        -H 'sec-fetch-mode: navigate' \
        -H 'sec-fetch-site: none' \
        -H 'sec-fetch-user: ?1' \
        -H 'upgrade-insecure-requests: 1' \
        -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36' \
        --compressed
        `
    }
    const linkRes = await request(reqUrl)
    
    writeToTestFile(linkRes.data)
    let res = linkRes.data.match(TITLE_REG)
    if(!res){//处理微信的链接
        res=linkRes.data.match(WX_META_REG)
    }
    if (res.length > 0) {
        return res[0].replace(TITLE_REG, '$1').replace(WX_META_REG,'$1')
    }
}
