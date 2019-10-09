'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');
//------------------------------------------
// 將使用者id存到資料庫
//------------------------------------------
var MessengeSelectSearch = async function(id){
    //存放結果
    let result;  
    //讀取資料庫
    await query('SELECT team.user_id,project_name,linebotpush FROM teammember as team INNER JOIN project ON(team.project_id=project.project_id) WHERE user_id=$1', [id])
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
module.exports = {MessengeSelectSearch};