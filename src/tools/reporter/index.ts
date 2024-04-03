import * as path from 'path'


import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType
} from 'docx'
import { h1, h2,projects } from './util'
import { styles,numbering } from './config'

export function generateReporter(rule:any){
    const {title,thisWeek,nextWeek}=rule
    const doc = new Document({
        numbering,
        styles: styles,
        sections: [
            {
                properties: {},
                children: [
                    h1(title),
                    new Paragraph({
                        text:'报告人：纪晓飞',
                        shading:{
                            fill: "CCCCCC",
                        },
                        spacing: {
                            before: 500, // 设置段落前面间距为300
                            line: 2, // 设置行间距为2倍行高
                            lineRule: "auto",
                          },
                    }),
                    new Paragraph({
                        text:'报告时间：2018年8月27日 ~ 2018年8月31日',
                        shading:{
                            fill: "CCCCCC",
                        },
                        spacing: {
                            before: 100,
                        },
                    }),
                    h2('一、本周主要工作'),
                    ...projects(thisWeek),
                    h2('二、下周计划'),
                    ...projects(nextWeek) 
                ]
            },
        ]
    })
    // Used to export the file into a .docx file
    return Packer.toBuffer(doc)
}
