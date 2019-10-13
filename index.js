//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const Admin = require('./utility/Admin');
const Messenge = require('./utility/Messenge');
var myFunction = require('./utility/myFunction');
//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1623913058',
    channelSecret: 'd391ffcbe15aa40a60143a360688215d',
    channelAccessToken: 'Ve75F0ujyEhnbXiiXeFPbUODz1HtYSd5gokKP4npeWt3C2LMV8a6tbUTZAqzDUB84/oFOBAxJkoUfazGlWuiFdjk8CcfQFUTrvbin37xwAuGMedo8sTwip+1KwAe/nNIuhEGvsPs+S0ykkuwynuGTAdB04t89/1O/w1cDnyilFU='
});
//--------------------------------
// 讓她不睡覺
//--------------------------------
var https = require('https');
setInterval(function () {
    https.get(" https://hao-planyourself-app.herokuapp.com/");
}, 1500000);
//模板

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
bot.on('message', function (event) {
    event.reply({
        "type": "flex",
        "altText": "予約票", //Reservation
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "xl",
            "contents": [
              {
                "type": "text",
                "text": "予約票", //Reservation
                "align": "center",
                "size": "xl",
                "color": "#1DB446"
              },
              {
                "type": "separator"
              },
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "flex": 8,
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "10年後の仕事図鑑",  // Book title (The map of professions for 10 years later)
                        "weight": "bold"
                      },
                      {
                        "type": "text",
                        "text": "順番：191/233", // Order
                        "size": "xs",
                        "color": "#aaaaaa"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      })
})
//========================================
// 機器人接受訊息的處理
//========================================
// bot.on('message', function(event) {
//     event.source.profile().then(
//         function (profile) {
//             if(event.message.text=="#我的計畫" || event.message.text=="#我的計劃" || event.message.text=="#我的專案"){
//                 Messenge.MessengeSelectSearch(profile.userId).then(data =>{
//                     if(data==-1){
//                         event.reply('您可能還沒加入任何計畫哦！')
//                     }
//                     else{
//                         // event.reply('『以下是您的計畫』');
//                         // for(let i=0; i<data.length; i++){
//                             let pushWorkText = '';
//                             // if(data[i].linebotpush){
//                                 console.log('here')
//                                 event.reply(
//                                     {
//                                         "type": "bubble",
//                                         "body": {
//                                           "type": "box",
//                                           "layout": "horizontal",
//                                           "contents": [
//                                             {
//                                               "type": "image",
//                                               "url": "https://example.com/flex/images/image.jpg"
//                                             },
//                                             {
//                                               "type": "text",
//                                               "text": "top",
//                                               "gravity": "top"
//                                             },
//                                             {
//                                               "type": "text",
//                                               "text": "center",
//                                               "gravity": "center"
//                                             },
//                                             {
//                                               "type": "text",
//                                               "text": "bottom",
//                                               "gravity": "bottom"
//                                             }
//                                           ]
//                                         }
//                                       }
//                                 );
//                                 // pushWorkText ='【'+data[i].project_name+'】';
//                                 // pushWorkText =
//                                 // bot.push(profile.userId, [pushWorkText]);
//                             // }
//                         // }
//                     }
//                 })
//             }
//             if(event.message.text=="#我的工作"){
//                 Messenge.WorkSelectSearch(profile.userId).then(data =>{
//                     console.log('index');
//                     console.log(data);
//                     if(data==-1){
//                         console.log('come')
//                         event.reply('您可能還沒任何工作哦！');
//                     }
//                     else{
//                         event.reply('『以下是您的工作』');
//                         for(let i=0; i<data.length; i++){
//                             let pushWorkText = '';
//                             if(data[i].work_hint){
//                                 pushWorkText ='【'+data[i].work_title+'】';
//                                 bot.push(profile.userId, [pushWorkText]);
//                             }
//                         }
//                     }
//                 })
//             }
//             if(event.message.text=="#快到期計畫" || event.message.text=="#快到期計劃" || event.message.text=="##快到期專案" ){
//                 Messenge.MessengeSelectSearch(profile.userId).then(data =>{
//                     console.log('index');
//                     console.log(data);
//                     if(data==-1){
//                         event.reply('您可能還沒任何計畫快到期哦！');
//                     }
//                     else{
//                         for(let i=0; i<data.length; i++){
//                             let pushWorkText = '';
//                             if(data[i].linebotpush){
//                                 var dateBegin = new Date(data[i].project_enddate);//将-转化为/，使用new Date
//                                 console.log(dateBegin);
//                                 var dateEnd = new Date(Date.now() + (8 * 60 * 60 * 1000));//获取当前时间
//                                 console.log(dateEnd);
//                                 var dateDiff = dateBegin.getTime() - dateEnd.getTime();//时间差的毫秒数
//                                 var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
//                                 var leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
//                                 var hours=Math.floor(leave1/(3600*1000))//计算出小时数
//                                 //计算相差分钟数
//                                 var leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
//                                 var minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
//                                 //计算相差秒数
//                                 var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
//                                 var seconds=Math.round(leave3/1000)
//                                 console.log(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
//                                 if(hours<5 && hours>=0){
//                                     date=myFunction.SeparateDate(data[i].project_enddate)
//                                     pushWorkText ='專案名稱'+'\n'+
//                                                     +'〖'+ data[i].project_name +'】'+'\n'+
//                                                     '結束時間:'+date[0] + '/' + date[1] + '/' + date[2] + ' ' +
//                                                     date[3] + ':' + date[4] + ':' + date[5];
//                                     bot.push(profile.userId, [pushWorkText]);
//                                 }
//                             }
//                         }
//                     }
//                 })
//             }	
//         }
//     );
// });
//--------------------------------
// 更新資料
//--------------------------------
function UpdateAllWorkData() {
    Admin.AdminMessengePushJdge().then(data => {
        clearTimeout(updataData);
        allWorkData = [];
        stringAllWorkData = [];
        for (let a = 0; a < data.length; a++) {
            let adminpush_enddate = myFunction.SeparateDate(data[a].adminpush_enddate + '')
            let workData = {
                user_id: data[a].user_id,
                linebotpush: data[a].linebotpush,
                adminpush_content: data[a].adminpush_content,
                adminpush_enddate: adminpush_enddate,
            }
            if (!stringAllWorkData.includes(JSON.stringify(workData))) {
                stringAllWorkData.push(JSON.stringify(workData))
                allWorkData.push(workData)
            }
        }
    })
    let updataData = setInterval(UpdateAllWorkData, 600000);
}
// function UpdateAllProjectData() {
//     Admin.AdminMessengePushJdge().then(data => {
//     clearTimeout(updataData);
//         allProjectData = [];
//         stringAllProjectData = [];
//         for (let a = 0; a < data.length; a++) {
//             let project_enddate = myFunction.SeparateDate(data[a].project_enddate + '')
//             let ProjectData = {
//                 user_id: data[a].user_id,
//                 linebotpush: data[a].linebotpush,
//                 project_name: data[a].project_name,
//                 project_enddate: project_enddate,
//             }
//             if (!stringAllWorkData.includes(JSON.stringify(ProjectData))) {
//                 stringAllWorkData.push(JSON.stringify(ProjectData))
//                 allWorkData.push(ProjectData)
//             }
//         }
//     })
//     let updataData = setInterval(UpdateAllProjectData, 1000);
// }
UpdateAllWorkData();
// UpdateAllProjectData();
//--------------------------------
// 推播資料
//--------------------------------
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
        let AdminPushTime_1h = myFunction.BeforeDate(adminpush_enddate, [0, 0, 0, 1, 0, 0]);
        let AdminPushMessage_1h = true;
        for (let a = 0; a < 6; a++) {
            if (nowDateArray[a] != AdminPushTime_1h[a]) {
                AdminPushMessage_1h = false;
            }
        }

        if (AdminPushMessage_1h || AdminPushMessage_3h || AdminPushMessage_5h) {
            console.log('可以推波囉 正確進入了');
            pushWorkText =
                '組長提醒事項' + '\n' + '【' + allWorkData[allDataIndex].adminpush_content + '】' + '\n' + '結束時間:' +
                adminpush_enddate[0] + '/' + adminpush_enddate[1] + '/' + adminpush_enddate[2] + ' ' +
                adminpush_enddate[3] + ':' + adminpush_enddate[4] + ':' + adminpush_enddate[5];
            if (allWorkData[allDataIndex].linebotpush) {
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