//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const Admin = require('./utility/Admin');
var myFunction = require('./utility/myFunction');
//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1623913058',
    channelSecret: 'd391ffcbe15aa40a60143a360688215d',
    channelAccessToken: 'Ve75F0ujyEhnbXiiXeFPbUODz1HtYSd5gokKP4npeWt3C2LMV8a6tbUTZAqzDUB84/oFOBAxJkoUfazGlWuiFdjk8CcfQFUTrvbin37xwAuGMedo8sTwip+1KwAe/nNIuhEGvsPs+S0ykkuwynuGTAdB04t89/1O/w1cDnyilFU='
    // channelId: '1619171290',
    // channelSecret: 'eb906d05aa2d55ad9fd3d44562bbc1eb',
    // channelAccessToken: 'fyncnllqd/2OQtfBse6gMzVA9X1Et+bxEIBrvkijPOyVlTZcBbvfpDMwqFV3C3CwwJ5y2eo/FMu0ZvwZHULlu/wU5YTUT2ZQLrviHO8oZ12zzBpXw59kO15VY+tZCgJEaTwQksw9V9jfZs/oPZ1QgwdB04t89/1O/w1cDnyilFU='
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


bot.on('message', function(event) {
    event.source.profile().then(
        function (profile) {		
            return event.reply('你好, ' + profile.displayName + '. 你的編號是:' + profile.userId + ', 你的回應是:' +  event.message.text);
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
// 更新資料
//--------------------------------
function UpdateAllWorkData() {
    Admin.AdminMessengePushJdge().then(data => {
        allWorkData = [];
        stringAllWorkData = [];
        for (let a = 0; a < data.length; a++) {
            let adminpush_enddate = myFunction.SeparateDate(data[a].adminpush_enddate + '')
            let workData = {
                user_id: data[a].user_id,
                adminpush_content: data[a].adminpush_content,
                adminpush_enddate: adminpush_enddate,
            }
            if (!stringAllWorkData.includes(JSON.stringify(workData))) {
                stringAllWorkData.push(JSON.stringify(workData))
                allWorkData.push(workData)
            }
        }
    })
}

UpdateAllWorkData();

let updataData = setInterval(UpdateAllWorkData, 600000);

let push = setInterval(function () {
    let nowDateArray = myFunction.SeparateDate(Date());
    nowDateArray[3] += 8;
    for (let allDataIndex = 0; allDataIndex < allWorkData.length; allDataIndex++) {
        let adminpush_enddate = allWorkData[allDataIndex].adminpush_enddate;
        let pushWorkText = '';
        // =================================專案提醒判斷================================
        // 在5個小時前
        let AdminPushTime_5h = myFunction.BeforeDate(adminpush_enddate, [0, 0, 0, 5, 0, 0]);
        let AdminPushMessage_5h = true;
        for (let a = 0; a < 6; a++) {
            if (nowDateArray[a] != AdminPushTime_5h[a]) {
                AdminPushMessage_5h = false;
            }
        }

        // 在3個小時前
        let AdminPushTime_3h = myFunction.BeforeDate(adminpush_enddate, [0, 0, 0, 3, 0, 0]);
        let AdminPushMessage_3h = true;
        for (let a = 0; a < 6; a++) {
            if (nowDateArray[a] != AdminPushTime_3h[a]) {
                AdminPushMessage_3h = false;
            }
        }

        // 在1個小時前
        let AdminPushTime_1h = myFunction.BeforeDate(adminpush_enddate, [0, 0, 0, 0, 10, 0]);
        console.log('推播時間')
        console.log(AdminPushTime_1h);
        console.log('目前時間')
        console.log(nowDateArray);
        let AdminPushMessage_1h = true;
        for (let a = 0; a < 6; a++) {
            if (nowDateArray[a] != AdminPushTime_1h[a]) {
                AdminPushMessage_1h = false;
            }
        }

        if (AdminPushMessage_1h || AdminPushMessage_3h || AdminPushMessage_5h) {
            pushWorkText =
                '組長提醒【' + allWorkData[allDataIndex].project_name + '】將在\n' +
                project_enddate[0] + '/' + project_enddate[1] + '/' + project_enddate[2] + ' ' +
                project_enddate[3] + ':' + project_enddate[4] + ':' + project_enddate[5] + '結束';
            if (allWorkData[allDataIndex].linebotpush && allWorkData[allDataIndex].project_hint) {
                userId = allWorkData[allDataIndex].user_id;
                bot.push(userId, [pushWorkText]);
            }
        }
    }
}, 1000);
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