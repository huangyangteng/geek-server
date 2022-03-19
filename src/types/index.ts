export interface OkPacket {
    fieldCount: number
    affectedRows: number
    insertId: number
    serverStatus: number
    warningCount: number
    message: number
    protocol41: boolean
    changedRows: number
  }
  export interface RequestRes{
    code:number,
    data:any,
  }