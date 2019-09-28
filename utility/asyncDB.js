'use strict';

//-----------------------
// 引用資料庫模組
//-----------------------
const {Client} = require('pg');
//-----------------------
// 自己的資料庫連結位址
//-----------------------
var pgConn = 'postgres://mzukkxyyafifqy:bb0667ca834a71be9f9d62c8d2e34ffa6fd5f71d24c1e73dc9577a679de7b379@ec2-107-20-173-2.compute-1.amazonaws.com:5432/dccrc717t7kg91';

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
                console.log('觸發這邊的err')
                reject(err);
            }else{
                resolve(results);
            }

            //關閉連線
            client.end();
        });
    });
}

//匯出
module.exports = query;