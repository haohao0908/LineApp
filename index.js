//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');


//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1623913058',
    channelSecret: 'd391ffcbe15aa40a60143a360688215d',
    channelAccessToken: 'Ve75F0ujyEhnbXiiXeFPbUODz1HtYSd5gokKP4npeWt3C2LMV8a6tbUTZAqzDUB84/oFOBAxJkoUfazGlWuiFdjk8CcfQFUTrvbin37xwAuGMedo8sTwip+1KwAe/nNIuhEGvsPs+S0ykkuwynuGTAdB04t89/1O/w1cDnyilFU='
});


//----------------------------------------
// 機器人接受訊息的處理
//----------------------------------------
bot.on('message', function(event) {
    event.source.profile().then(
        function (profile) {
            const name = profile.displayName;
            const userId = profile.userId;
            const msg = event.message.text;
            
            //最多支援5個訊息
            return event.reply([
                {
                    "type": "text",
                    "text": '這是你的名字:'+name
                },
                {
                    "type": "text",
                    "text": '這是你的userId:'+userId
                },
                {
                    "type": "text",
                    "text": '你剛剛打的訊息'+msg
                }
            ]);	            
        }
    );
});


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
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log("正在監聽埠號:", port);
});