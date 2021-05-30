export interface UserItem {
    id?: string
    state?: number
    name:string
    age:number
    sex:Sex
    phone:string
    profilePhoto?:string
}
export enum Sex{
    male=0, //男
    female=1 //女
}