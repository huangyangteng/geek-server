const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
        user: '3034647379@qq.com',
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: 'vgxabsevparpdfej',
    },
})

let mailOptionError = {
    from: '"ETF" <3034647379@qq.com>', // sender address
    to: 'huangyangteng@ebupt.com', // list of receivers
    subject: 'ETF', // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: '<b>ETF</b>', // html body
}
let mailOptionSuccess = {
    from: '"掘金自动签到成功" <3034647379@qq.com>', // sender address
    to: 'huangyangteng@ebupt.com', // list of receivers
    subject: '掘金自动签到成功', // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: '<b>掘金自动签到成功</b>', // html body
}
const eftOptions={
    from: '"ETF" <3034647379@qq.com>', // sender address
    to: 'huangyangteng@ebupt.com', // list of receivers
    subject: 'ETF', // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: '<b>ETF</b>', // html body
}


export function sendEmail(subject:string,html?:string) {
    // send mail with defined transport object
    transporter.sendMail({
        ...eftOptions,
        subject,
        html:`<h1>${html?html:subject}</h1>`
    }, (error: any, info: any) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message sent: %s', info.messageId)
    })
}



