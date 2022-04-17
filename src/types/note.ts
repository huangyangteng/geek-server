export interface NoteItem{
    id:number
    value:string
    createDate:string
    updateDate:string
    userId:number
    connectId:number
    info:any
    tag?:string
}

export interface AddNotePayloadType{
    value:string
    userId:number
    connectId:number
    info:any
    tag?:string
}

