var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
const mysql = require('mysql');
var fs = require('fs');
const sUrl = "https://coinmarketcap.com/currencies/";
var aCoinList = [];
var nCoinNum,nCount = 0, nCount2=0;
const pool = mysql.createPool({
    host: 'localhost',
    user: 'topbtc',
    password: 'GRX@mysql1231',
    database: 'topbtc',
    port: 3306
});

console.log("======-------- Get Coin Info from coinmarketcap.com -------=======");
fs.readFile('./quickSearchCoin.json',function(err,data){
    if(err) throw err;
    var aCoins = JSON.parse(data);
    var CoinId;
    for (var i = 0; i < aCoins.length; i++) {
        sCoinId = aCoins[i]['i'];
        sCoinUrl = sUrl + sCoinId;
        if (sCoinUrl && sCoinId) {
            getCoinInfo(sCoinUrl, sCoinId);
            break;
        }
    }

});

function getCoinInfo(sCoinUrl, sCoinId) {
  request(sCoinUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body),
            oCoin,
            aLi= $('ul.list-unstyled > li');
        var oData = {
          WEBSITE:"",
          EXPLORER:"",
          MSGBOADR:"",
          MINEABLE:false,
          ISASSET:false
        }
        for (var i = 0; i < aLi.length; i++) {
          var sUrl,
              oLi = aLi.eq(i),
              sTitle = oLi && oLi.children('span').attr('title');
          if(sTitle == 'Website'){
            sUrl = oLi.children('a').attr('href');
            oData.WEBSITE = oData.WEBSITE == "" ? sUrl : oData.WEBSITE + "," + sUrl;
          }else if(sTitle == 'Explorer'){
            sUrl = oLi.children('a').attr('href');
            oData.EXPLORER = oData.EXPLORER == "" ? sUrl : oData.EXPLORER + "," + sUrl;
          }else if(sTitle == 'Message Board'){
            sUrl = oLi.children('a').attr('href');
            oData.MSGBOADR = oData.MSGBOADR == "" ? sUrl : oData.MSGBOADR + "," + sUrl;
          }else if(sTitle == 'Tags'){
            var aTag = oLi.children('small').children('span');
            for (var j = 0; j < aLi.length; j++) {
              var sText = aTag.eq(j).text();
              if(sText == "Mineable"){
                  oData.MINEABLE = true;
              }else if(sText == "Asset"){
                  oData.ISASSET = true;
              }
            }
          }
        }
        console.log(oData);
    }
  });
}
