'use strict';

//-----------------------
// 引用資料庫模組
//-----------------------
const {Client} = require('pg');
//-----------------------
// 自己的資料庫連結位址
//-----------------------
var pgConn = 'postgres://blgwsyskuyxazi:59788010e5b634281ca8dafa0e824635aba960fa3ae22af0deac4f916d9367be@ec2-54-197-239-115.compute-1.amazonaws.com:5432/dc0gchj9ibuh72';


//產生可同步執行query物件的函式
function query(sql, value=null) {
    return new Promise((resolve, reject) => {
        //設定資料庫連線物件
        var client = new Client({
            connectionString: pgConn,
            ssl: true
        })     

        //連結資料庫
        client.connect();

        //回覆查詢結果  
        client.query(sql, value, (err, results) => {                   
            if (err){
                reject(err);
            }else{
                console.log('有連接資料庫')
                resolve(results);
            }

            //關閉連線
            client.end();
        });
    });
}

//匯出
module.exports = query;