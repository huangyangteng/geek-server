const mysql = require('mysql');
const MYSQL_CONFIG = require('./config')
let config = {
    ...MYSQL_CONFIG,
    port:3306,
    multipleStatements: true//允许多条sql同时执行
};
let pool = mysql.createPool(config);
// let query = (sql:string, values:any):Promise<any> => {
    
//     return new Promise((resolve, reject) => {
//         pool.getConnection((err:any, connection:any) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 connection.query(sql, values, (err:any, rows:any) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(rows)
//                     }
//                     connection.end()
//                 })
//             }
//         })
//     })
// };
// export default query

export function query<T>(sql:string, values:any=null):Promise<T>{
    return new Promise((resolve, reject) => {
        pool.getConnection((err:any, connection:any) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err:any, rows:T) => {
                    if (err) {
                        reject(err)
                    } else {
                        // console.log(rows)
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}