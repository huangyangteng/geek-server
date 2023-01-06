export enum EftStatusType{
    pause='pause',
    running='running',
}
export interface EtfItem{
    id?:string
    code:string  //代码
    name:string
    buy1:number
    buy2?:number
    sell1:number
    sell2?:number
    status:EftStatusType
    info?:string
}
