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
// let letselectUser = setInterval(function () {
//     var allUsers = [];
//     Admin.SelectSaveUser().then(data => {
//         if (data == -1) {
//             event.reply('找不到資料');
//         } else if (data == -9) {
//             event.reply('執行錯誤');
//         } else {
//             data.forEach(item => {
//                 allUsers.push(item.userid);
//             });
//         }
//         if (allUsers != []) {
//             PushMsg(allUsers);
//         }
//     });
// }, 60000)
//--------------------------------
//推送訊息
//--------------------------------
// let push = setInterval(function PushMsg(id) {
//     let allUsers = id;
//     for (var i = 0; i < allUsers.length; i++) {
//         Admin.AdminMessengePushJdge(allUsers[i]).then(data => {
//             if (data == -1) {
//                 console.log('觸發-1');
//             }
//             else if (data == -9) {
//                 console.log('處發-9');
//             }
//             else {
//                 console.log('foreach');
//                 data.forEach(item => {
//                     console.log(item.adminpush_enddate);
//                     bot.push(item.user_id, '組長說：' + item.adminpush_content + '\n' + '到期時間' + item.adminpush_enddate);
//                 })
//             }
//         })
//     }
// }, 36000000)
// PushMsg();
// var timer;
// function PushMsg() {
//     clearTimeout(timer);
//     var allUsers = [];
//     Admin.SelectSaveUser().then(data => {
//         if (data == -1) {
//             event.reply('找不到資料');
//         } else if (data == -9) {
//             event.reply('執行錯誤');
//         } else {
//             data.forEach(item => {
//                 allUsers.push(item.userid);
//             });
//         }
//         if (allUsers != []) {
//             for (var i = 0; i < allUsers.length; i++) {
//                 Admin.AdminMessengePushJdge(allUsers[i]).then(data => {
//                     if (data == -1) {
//                         console.log('觸發-1');
//                     }
//                     else if (data == -9) {
//                         console.log('處發-9');
//                     }
//                     else {
//                         console.log('foreach');
//                         data.forEach(item => {
//                             console.log(item.adminpush_enddate);
//                             bot.push(item.user_id, '管理員說：' + '\n' + item.adminpush_content + '\n' + '到期時間' + '\n' +item.adminpush_enddate);
//                         })
//                     }
//                 })
//             }
//         }
//     });
//     timer=setInterval(PushMsg,1800000);
// }
//學yee部分改寫
// 每十分鐘更新一次資料
function UpdateAllWorkData() {
	Admin.AdminMessengePushJdge().then(data => {
		allWorkData = [];
		stringAllWorkData = [];
		for (let a = 0; a < data.length; a++) {
			let adminpush_enddate = myFunction.SeparateDate(data[a].adminpush_enddate + '')
			// let deadline = data[a].deadline != null ? myFunction.SeparateDate(data[a].deadline + '') : null
			let workData = {
				user_id: data[a].user_id,
				adminpush_content: data[a].adminpush_content,
				adminpush_enddate: adminpush_enddate,
            }
            console.log('workData');
            console.log(workData);
			if (!stringAllWorkData.includes(JSON.stringify(workData))) {
				stringAllWorkData.push(JSON.stringify(workData))
				allWorkData.push(workData)
			}

		}
		console.log(allWorkData)
	})
}

UpdateAllWorkData();

let updataData = setInterval(UpdateAllWorkData, 600000);

let push = setInterval(function () {
	let nowDateArray = myFunction.SeparateDate(Date());
	nowDateArray[3] += 8;
	for (let allDataIndex = 0; allDataIndex < allWorkData.length; allDataIndex++) {
		let adminpush_enddate = allWorkData[allDataIndex].adminpush_enddate;
		let pushProjectText = '';
		let pushWorkText = '';

		// =================================專案提醒判斷================================
		// 在12小時以前提醒專案到期
		let projectPushTime_12h = myFunction.BeforeDate(adminpush_enddate, [0, 0, 0, 12, 0, 0]);
		let projectPushMessage_12h = true;
		for (let a = 0; a < 6; a++) {
			if (nowDateArray[a] != projectPushTime_12h[a]) {
				projectPushMessage_12h = false;
			}
		}

		// 在一個禮拜以前提醒專案到期
		let projectPushTime_7d = myFunction.BeforeDate(adminpush_enddate, [0, 0, 7, 0, 0, 0]);
		let projectPushMessage_7d = true;
		for (let a = 0; a < 6; a++) {
			if (nowDateArray[a] != projectPushTime_7d[a]) {
				projectPushMessage_7d = false;
			}
		}

		// 在一個月以前提醒專案到期
		let projectPushTime_1m = myFunction.BeforeDate(adminpush_enddate, [0, 1, 0, 0, 0, 0]);
		let projectPushMessage_1m = true;
		for (let a = 0; a < 6; a++) {
			if (nowDateArray[a] != projectPushTime_1m[a]) {
				projectPushMessage_1m = false;
			}
		}

		if (projectPushMessage_12h || projectPushMessage_7d || projectPushMessage_1m) {
			pushProjectText = 
				'您的專案【' + allWorkData[allDataIndex].project_name + '】將在\n' +
				project_enddate[0] + '/' + project_enddate[1] + '/' + project_enddate[2] + ' ' +
				project_enddate[3] + ':' + project_enddate[4] + ':' + project_enddate[5] + '結束';
			if (allWorkData[allDataIndex].linebotpush && allWorkData[allDataIndex].project_hint) {
				userId = allWorkData[allDataIndex].user_id;
				bot.push(userId, [pushWorkText]);
			}
		}

		// =================================工作提醒判斷================================
		// if (deadline != null) {
		// 	// 在1小時以前提醒工作到期
		// 	let workPushTime_12h = myFunction.BeforeDate(deadline, [0, 0, 0, 1, 0, 0]);
		// 	let workPushMessage_12h = true;
		// 	for (let a = 0; a < 6; a++) {
		// 		if (nowDateArray[a] != workPushTime_12h[a]) {
		// 			workPushMessage_12h = false;
		// 		}
		// 	}

		// 	// 在一天以前提醒工作到期
		// 	let workPushTime_7d = myFunction.BeforeDate(deadline, [0, 0, 1, 0, 0, 0]);
		// 	let workPushMessage_7d = true;
		// 	for (let a = 0; a < 6; a++) {
		// 		if (nowDateArray[a] != workPushTime_7d[a]) {
		// 			workPushMessage_7d = false;
		// 		}
		// 	}

		// 	// 在三天以前提醒專案到期
		// 	let workPushTime_1m = myFunction.BeforeDate(deadline, [0, 0, 3, 0, 0, 0]);
		// 	let workPushMessage_1m = true;
		// 	for (let a = 0; a < 6; a++) {
		// 		if (nowDateArray[a] != workPushTime_1m[a]) {
		// 			workPushMessage_1m = false;
		// 		}
		// 	}

		// 	if (workPushMessage_12h || workPushMessage_7d || workPushMessage_1m) {
		// 		pushWorkText = 'Hi! ' + allWorkData[allDataIndex].member_name + '\n' +
		// 			'您在專案【' + allWorkData[allDataIndex].project_name + '】的工作\n' +
		// 			'「' + allWorkData[allDataIndex].work_title + '」將在\n' +
		// 			deadline[0] + '/' + deadline[1] + '/' + deadline[2] + ' ' +
		// 			deadline[3] + ':' + deadline[4] + ':' + deadline[5] + '結束';
		// 		if (allWorkData[allDataIndex].linebotpush && allWorkData[allDataIndex].work_hint) {
		// 			userId = allWorkData[allDataIndex].user_id;
		// 			bot.push(userId, [pushWorkText]);
		// 		}
		// 	}
		// }

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