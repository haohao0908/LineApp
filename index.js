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
bot.on('follow', function (event){
    event.source.profile().then(
        function (profile) {
            //取得使用者資料
            const userName = profile.displayName;
            const userId = profile.userId;    
            //呼叫API, 將使用者資料寫入資料庫
            Admin.SaveUser(userId, userName).then(data => {  
                if (data == -9){
                    event.reply('執行錯誤');
                }else{                   
                    event.reply('歡迎加入PlanYourself');
                }
            })  
        }
    );
});
//--------------------------------
// 機器人接受訊息的處理
//--------------------------------

bot.on('message', function (event) {
    event.source.profile().then(
        function (profile) {
            Admin.fetchAdmin().then(data => {
                console.log('回傳data資料')
                console.log(data);
                if (data == -1) {
                    event.reply('找不到資料');
                } else if (data == -9) {
                    event.reply('執行錯誤');
                } else {
                    event.reply([
                        {'type':'text', 'text':data.user_id},
                        {'type':'text', 'text':data.adminpush_content},
                    ]
                    );
                }
            })
        }
    );
});
//--------------------------------
// 機器人推播訊息
//---------//
setTimeout(function () {
    var userId = 'U32851128a5210964818860dd9204b886';
    var sendMsg = "push hands up ";
    bot.push(userId, [sendMsg]);
    console.log('userId: ' + userId);
    console.log('send: ' + sendMsg);
}, 10000);
//測試----------------------------
function PushMsg() {
    // clearTimeout(timer2);
    //存所有成員的id
    let allUsers = [];

    //取得所有userid
    Admin.SelectSaveUser().then(data => {
        if (data == -1){
            event.reply('找不到資料');
        }else if(data == -9){                    
            event.reply('執行錯誤');
        }else{
            data.forEach(item => {
                allUsers.push(item.userid);
            });
        }
        JudgeUserId(allUsers);
    });
    //將取得的userid丟進來判斷
    function JudgeUserId(allUsers){
        for(var i=0;i<allUsers.length;i++){
            adminmsg=[]
            console.log(allUsers[i]);
            Admin.AdminMessengePushJdge(allUsers[i]).then(data => {
                if (data == -1) {
                    event.reply('找不到資料');
                } else if (data == -9) {
                    event.reply('執行錯誤');
                } else {
                    data.forEach(item=>{
                        adminmsg.push(item.dminpush_content);
                    })
                }
                console.log('admin')
                console.log(adminmsg);
            })
            // bot.push(allUsers[i],adminmsg[i]);
            // adminmsg=[];
        }
    }
  }
  //啟動自動推播檢測
  PushMsg();
// setInterval(jp,120000);
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