export interface HistoryItem{
    id?:string
    userId:string
    type:HistoryType
    createdTime:string
    created_time?:string
    updateTime:string
    update_time?:string
    itemId:string 
    info:string
}
export enum HistoryType{
    column='column',
    video='video',
    audio='audio'
}