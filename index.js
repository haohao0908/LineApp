//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const Admin = require('./utility/Admin');
//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1623913058',
    channelSecret: 'd391ffcbe15aa40a60143a360688215d',
    channelAccessToken: 'Ve75F0ujyEhnbXiiXeFPbUODz1HtYSd5gokKP4npeWt3C2LMV8a6tbUTZAqzDUB84/oFOBAxJkoUfazGlWuiFdjk8CcfQFUTrvbin37xwAuGMedo8sTwip+1KwAe/nNIuhEGvsPs+S0ykkuwynuGTAdB04t89/1O/w1cDnyilFU='
});
//--------------------------------
// 使用者加入群組
//--------------------------------
bot.on('follow', function (event) {
    event.source.profile().then(
        function (profile) {
            //取得使用者資料
            const userName = profile.displayName;
            const userId = profile.userId;
            //呼叫API, 將使用者資料寫入資料庫
            Admin.SaveUser(userId, userName).then(data => {
                if (data == -9) {
                    event.reply('執行錯誤');
                } else {
                    event.reply('歡迎加入PlanYourself');
                }
            })
        }
    );
});
//--------------------------------
// 使用者封鎖群組
//--------------------------------
bot.on('unfollow', function (event) {
    //取得使用者資料
    const userId = event.source.userId;

    //呼叫API, 將使用者資料刪除
    Admin.DeleteUser(userId).then(data => {
        if (data == -9) {
            event.reply('執行錯誤');    //會員已封鎖群組, 本訊息無法送達
        } else {
            event.reply('已退出會員');  //會員已封鎖群組, 本訊息無法送達
        }
    });
});

//--------------------------------
// 機器人推播訊息
//--------------------------------
// setTimeout(function () {
//     var userId = 'U32851128a5210964818860dd9204b886';
//     var sendMsg = "push hands up ";
//     bot.push(userId, [sendMsg]);
//     console.log('userId: ' + userId);
//     console.log('send: ' + sendMsg);
// }, 10000);
//--------------------------------
// 查詢全部id
//--------------------------------
SelectUser();
// var timer;
function SelectUser(){
    // clearTimeout(timer);
    Admin.SelectSaveUser().then(data => {
        var allUsers = [];
        if (data == -1) {
            event.reply('找不到資料');
        } else if (data == -9) {
            event.reply('執行錯誤');
        } else {
            data.forEach(item => {
                allUsers.push(item.userid);
            });
        }
        if (allUsers != []) {
            PushMsg(allUsers);
        }
    });
    // timer = setInterval(SelectUser, 10000);
}
//--------------------------------
// 推送訊息
//--------------------------------
function PushMsg(id) {
    let DateSplit=[];
    let TimeSplit=[];
    let allUsers = id;
        for(var i=0; i<allUsers.length; i++){
            Admin.AdminMessengePushJdge(allUsers[i]).then(data => {
                if (data == -1) {
                    console.log('觸發-1');
                }
                else if (data == -9) {
                    console.log('處發-9');
                }
                else {
                    console.log('foreach');
                    data.forEach(item => {
                        timeFn(item.adminpush_enddate);
                        function timeFn(d1) {//傳入處理好的時間
                            var dateBegin = new Date(d1);//傳入參數
                            var dateEnd =new Date();
                            console.log(dateBegin);
                            console.log(dateEnd);
                            var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒數
                            var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天數
                            var leave1=dateDiff%(24*3600*1000)    //计算天數後剩餘的毫秒數
                            var hours=Math.floor(leave1/(3600*1000))//计算出小時數
                            //计算相差分鐘數
                            var leave2=leave1%(3600*1000)    //计算小时數後剩餘毫秒數
                            var minutes=Math.floor(leave2/(60*1000))//计算相差分鐘數
                            //计算相差秒數
                            var leave3=leave2%(60*1000)      //计算分鐘數後剩餘毫秒數
                            var seconds=Math.round(leave3/1000)
                            console.log(" 相差 "+dayDiff+"天 "+hours+"小時"+minutes+"分鐘"+seconds+" 秒")
                            console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数"
                                ,hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数");
                        }
                        bot.push(item.user_id,'組長說：'+item.adminpush_content+'\n'+'到期時間'+item.adminpush_enddate);
                    })
                }
            })
        }
}
//----------------------------------------
// 建立一個網站應用程式app
// 如果連接根目錄, 交給機器人處理
//----------------------------------------
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//----------------------------------------
// 可直接取用檔案的資料夾
//----------------------------------------
app.use(express.static('public'));

//----------------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//----------------------------------------
var server = app.listen(process.env.PORT || 3000, function () {
    const port = server.address().port;
    console.log("正在監聽埠號:", port);
});