'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 由學號查詢學生資料
//------------------------------------------
var fetchMember = async function(id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('SELECT mem.user_id,admin.adminpush_content FROM adminpush as admin INNER JOIN teammember as mem ON (admin.project_id=mem.project_id)')
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows;  //學生資料(物件)
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    console.log(result);
    return result;  
}
//------------------------------------------

//匯出
module.exports = {fetchMember};