import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType
} from 'docx'
export function h1(text:string,props={}) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        text,
        ...props
    })
}
export function h2(text:string,props={}){
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        text,
        ...props
    })
}
export function h3(text:string,props={}){
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        alignment: AlignmentType.LEFT,
        numbering: {
            reference: 'reporter-numbering',
            level: 0, 
          },
        text,
        ...props
    })
}
export function h4(text:string,props={}){
    return new Paragraph({
        heading: HeadingLevel.HEADING_4,
        alignment: AlignmentType.LEFT,
        text,
        ...props
    })
}

export function projects(list:any){
    return list.map((item:any)=>project(item)).flat()
}

export function project(info:any){
    const {name,progress,deadline,content}=info
    return [
        h3(name),
        new Paragraph({
            children: [new TextRun("时间安排")],
            numbering: {
                reference: 'reporter-numbering',
                level: 1,
              },
        }),
        new Paragraph({
            children: [new TextRun("本周完成进度："),new TextRun(progress+'%')],
            numbering: {
                reference: 'reporter-numbering',
                level: 2,
              },
        }),
        new Paragraph({
            children: [new TextRun("计划完成日期："),new TextRun(deadline)],
            numbering: {
                reference: 'reporter-numbering',
                level: 2,
              },
        }),
        // new Paragraph({
        //     children: [new TextRun("First item")],
        //     numbering: {
        //         reference: 'reporter-numbering',
        //         level: 3,
        //       },
        // }),
        new Paragraph({
            children: [new TextRun("工作内容")],
            numbering: {
                reference: 'reporter-numbering',
                level: 1,
              },
        }),
        ...content.map((item:any)=> new Paragraph({
            children: [new TextRun(item)],
            numbering: {
                reference: 'reporter-numbering',
                level: 2,
              },
        }),)
       
    ]
}