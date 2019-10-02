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
var AdminMessengePushJdge = async function(id){
    //存放結果
    let result;
    let result2=[];  
    //讀取資料庫
    await query('SELECT mem.user_id,admin.adminpush_content,admin.adminpush_enddate FROM teammember as mem INNER JOIN adminpush as admin ON (admin.project_id=mem.project_id)WHERE mem.user_id=$1', [id])
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows;  //學生資料(物件)
                result.forEach(item => {
                    timeFn(item.adminpush_enddate);
                });
                //判斷是否在到期3小時內，每1小時推播一次
                function timeFn(d1) {//傳入處理好的時間
                    // para = d1.toString();
                    var dateBegin = new Date(d1);//傳入參數
                    var dateEnd = new Date().zoneDate();
                    var dateDiff = dateBegin.getTime() - dateEnd.getTime();//时间差的毫秒數
                    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天數
                    var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天數後剩餘的毫秒數
                    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小時數
                    //计算相差分鐘數
                    var leave2 = leave1 % (3600 * 1000)    //计算小时數後剩餘毫秒數
                    var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分鐘數
                    //计算相差秒數
                    var leave3 = leave2 % (60 * 1000)      //计算分鐘數後剩餘毫秒數
                    var seconds = Math.round(leave3 / 1000)
                    console.log(" 相差 " + dayDiff + "天 " + hours + "小時" + minutes + "分鐘" + seconds + " 秒")
                    if(hours<3 && hours >=0){
                        result2.push(item);
                        console.log('result2');
                        console.log(result2);
                    }
                    // if (hours < 3 && hours >= 0) {
                    //     console.log('進行推播')
                    //     BotPushMsg()
                    //     var timer2;
                    //     function BotPushMsg() {
                    //         clearTimeout(timer2);
                    //         bot.push(item.user_id, '組長說：' + item.adminpush_content + '\n' + '到期時間' + item.adminpush_enddate);
                    //         timer2 = setInterval(BotPushMsg, 1000 * 60 * 60);
                    //     }

                    // }
                }
            }else{
                result2 = -1;  //找不到資料
            }    
        }, (error) => {
            result2 = -9;  //執行錯誤
        });
        // console.log('api回傳')
        // console.log(result2);
        // return result2;  
}
//------------------------------------------
//匯出
module.exports = {SaveUser,SelectSaveUser,DeleteUser,AdminMessengePushJdge};