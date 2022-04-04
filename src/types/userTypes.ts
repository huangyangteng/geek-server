export interface UserItem {
    id?: string
    cover?:string //封面
    avatar?:string //头像
    password?:string
    username:string
    cookie?:string
    filter?:string
}
export enum Sex{
    male=0, //男
    female=1 //女
}