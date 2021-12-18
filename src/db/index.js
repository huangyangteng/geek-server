const query=require('./mysql');
(async()=>{
    const data=await query('SELECT * from user')
    console.log('data',data[0])
})();
