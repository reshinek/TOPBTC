var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
const mysql = require('mysql');
var fs = require('fs');
const sUrl = "https://coinmarketcap.com";
var aCoinList = [];
var nCoinNum,nCount = 0;
const pool = mysql.createPool({
    host: 'localhost',
    user: 'topbtc',
    password: 'GRX@mysql1231',
    database: 'topbtc',
    port: 3306
});

console.log("======-------- Get Coin data from coinmarketcap.com -------=======");
request('https://api.coinmarketcap.com/v1/ticker/?convert=CNY', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Succeed to get coin list, start to process data...");
        var aCoins = JSON.parse(body),
            oCoin,
            oData;
        nCoinNum = aCoins.length;
        for (var i = 0; i < nCoinNum; i++) {
            oCoin = aCoins[i];
            oData = {
                COINID: oCoin.id,
                NAME_EN: oCoin.name,
                CODE: oCoin.symbol,
                PRICE: oCoin.price_cny,
                VOLUME: oCoin['24h_volume_cny'],
                MARKET_CAP: oCoin.market_cap_cny,
                P1H: oCoin.percent_change_1h,
                P24H: oCoin.percent_change_24h,
                P7D: oCoin.percent_change_7d,
                AVAILABLE_SUPPLY: oCoin.available_supply,
                TOTAL_SUPPLY: oCoin.total_supply,
                RANK: oCoin.rank
            };
            aCoinList.push({
                i:oCoin.id,
                n:oCoin.name,
                c:oCoin.symbol,
                b: true
            });
            pool.query('replace into coin set ?', oData, function (err, result) {
                if (err){
                    throw err
                }
                nCount++;
                console.log('['+ nCount +'/'+ nCoinNum +'] SUCCEED');
                if(nCount == nCoinNum){
                    console.log('Update coin data completed.');
                    console.log("Creating quickSearchCoin Json File...");
                    var sJson =  JSON.stringify(aCoinList);
                    fs.writeFile("quickSearchCoin.json",sJson,function (err) {
                        if (err) {
                            throw err ;
                        }
                        console.log("quickSearchCoin File Saved !");
                        console.log('\n=========------Process Exit------=========');
                        process.exit();
                    }) ;

                }
            });
        }

    }
});