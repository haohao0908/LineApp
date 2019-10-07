'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');
//------------------------------------------
// 將使用者id存到資料庫
//------------------------------------------
var SaveUser = async function(id,name){
    //存放結果
    let result;  
    //讀取資料庫
    await query('insert into savelineuser (userid,username) values ($1,$2)', [id,name])
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows[0];  //學生資料(物件)
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
        return result;  
}
//------------------------------------------
// 將使用者id刪除
//------------------------------------------
var DeleteUser = async function(id){
    //存放結果
    let result;  
    //讀取資料庫
    await query('delete from savelineuser where userid = $1',[id])
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rowCount;  //刪除資料數 
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
        return result;  
}
//------------------------------------------
// 查詢全部id
//------------------------------------------
var SelectSaveUser = async function(){
    //存放結果
    let result;  
    //讀取資料庫
    await query('select userid from savelineuser')
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
        return result;  
}
//------------------------------------------
// 撈取要推播的資訊
//------------------------------------------
var AdminMessengePushJdge = async function(){
    //存放結果
    let result;
    //讀取資料庫
    await query("SELECT tem.user_id,admin.adminpush_content,admin.adminpush_enddate,mem.linebotpush FROM teammember as tem INNER JOIN adminpush as admin ON (admin.project_id=tem.project_id) INNER JOIN member as mem ON (tem.user_id=mem.user_id)")
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows;  //學生資料(物件)
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });
    return result;  
}
//------------------------------------------
//匯出
module.exports = {SaveUser,SelectSaveUser,DeleteUser,AdminMessengePushJdge};