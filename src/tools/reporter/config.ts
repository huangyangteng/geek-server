// import * as docx from 'docx'
import {LevelFormat,AlignmentType,convertInchesToTwip} from 'docx'
// import {configs} from './testAlignment.js'
export const rule = {
    title: '2018年8月第5周工作周报',
    person: '张三',
    date: ['2018年8月27日', '2018年8月31日'],
    thisWeek: [
        {
            name: '移动视频彩铃',
            progress: '80',
            deadline: '3.31',
            content: [
                '转盘活动问题，定位抽奖功能异常原因：获取用户信息数据延迟，添加延迟处理，解决了异常。',
                '转盘活动测试，对领导提出的意见进行系统测试和优化。',
                '配合新版本H5改造：添加新接口，以满足H5需求'
            ]
        },
        {
            name: '联通视频彩铃',
            progress: '80',
            deadline: '3.31',
            content: [
                '转盘活动问题，定位抽奖功能异常原因：获取用户信息数据延迟，添加延迟处理，解决了异常。',
                '转盘活动测试，对领导提出的意见进行系统测试和优化。',
                '配合新版本H5改造：添加新接口，以满足H5需求'
            ]
        }
    ],
    nextWeek: [
        {
            name: '视频制作',
            progress: '80',
            deadline: '',
            content: ['完成IVVRr任务的获取及渲染', '完成形状功能的渲染']
        }
    ]
}

export const styles = {
    default:{
        document:{
            paragraph: {
                spacing: {
                    line:300
                }
            }
        }
    },
    paragraphStyles: [
        {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
                size: 30,
                bold: true,
                color: '000000'
            },
            paragraph: {
                spacing: {
                    before: 100,
                    after: 100
                }
            }
        },
        {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
                size: 30,
                bold: true,
                color: '000000'
            },
            paragraph: {
                spacing: {
                    before: 240,
                    after: 240
                }
            }
        },
        {
            id: 'Heading3',
            name: 'Heading 3',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
                size: 28,
                bold: true,
                color: '000000'
            },
            paragraph: {
                spacing: {
                    before: 240,
                    after: 240
                }
            }
        },
    ]
}

export const numbering = {
        config:[
            {
                reference:'reporter-numbering',
                levels:[
                    /**
                     * 0  1.1  LEADING_NUMERIC
                     * 1  1)   DECIMAL ? DECIMAL_PARENTHESES?
                     * 2  a) b) LOWER_LETTER
                     * 3  i ii  LOWER_ROMAN
                     */
                    {
                        level: 0,
                        //@ts-ignore
                        format: LevelFormat.LEADING_NUMERIC,
                        text: '%1.',
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: {
                                    left: convertInchesToTwip(0.2),
                                    hanging: convertInchesToTwip(0.2)
                                }
                            }
                        }
                    },
                    {
                        level: 1,
                         //@ts-ignore
                        format: LevelFormat.LEADING_NUMERIC,
                        text: '%2)',
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: {
                                    left: convertInchesToTwip(0.3),
                                    hanging: convertInchesToTwip(0.2)
                                }
                            }
                        }
                    },
                    {
                        level: 2,
                        format: LevelFormat.LOWER_LETTER,
                        text: '%3)',
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: {
                                    left: convertInchesToTwip(0.6),
                                    hanging: convertInchesToTwip(0.2)
                                }
                            }
                        }
                    },
                    {
                        level: 3,
                        format: LevelFormat.LOWER_ROMAN,
                        text: '%4',
                        alignment: AlignmentType.START,
                        style: {
                            paragraph: {
                                indent: { left: convertInchesToTwip(0.9), hanging: convertInchesToTwip(0.2) }
                            }
                        }
                    }
                ]
            },
           
        ]
    }

