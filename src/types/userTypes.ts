export interface UserItem {
    id?: string
    state?: number
    name:string
    cover?:string //封面
    head?:string //头像
    password?:string
    phone:string
}
export enum Sex{
    male=0, //男
    female=1 //女
}