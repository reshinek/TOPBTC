var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
const mysql = require('mysql');
var fs = require('fs');
const sUrl = "https://coinmarketcap.com";
var aJson = {};
var aMarketList = [];
var nMarket,nCount = 0;
var nTableRow=0,nCount2 = 0;
var queryCount = 0;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'topbtc',
    password: 'GRX@mysql1231',
    database: 'topbtc',
    port: 3306
});

console.log("====================================================================");
console.log("======-------- Get market data from coinmarketcap.com -------=======");
console.log("====================================================================");

console.log("Start program...");
request('https://coinmarketcap.com/exchanges/volume/24-hour/all/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var aMarkets = $('h3.volume-header').children("a"),
            sMarketUrl,
            sMarketId;
        nMarket = aMarkets.length;
        console.log("Succeed to get Market list, start to getting coin data...");
        for (var i = 0; i < aMarkets.length; i++) {
            sMarketUrl = aMarkets[i].attribs.href;
            sMarketUrl = sMarketUrl.slice(0, sMarketUrl.length - 1)
            sMarketId = sMarketUrl && sMarketUrl.slice(sMarketUrl.lastIndexOf('/') + 1);
            if (sMarketUrl && sMarketId) {
                getMarketData(sMarketUrl, sMarketId);
                //break;
            }
        }
    }
});

function getMarketData(sMarketUrl, sMarketId) {
    sMarketUrl = sUrl + sMarketUrl;
    request(sMarketUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body),
                oCoin,
                oData;
            oData = {
                EXCHANGEID : sMarketId,
                NAME_EN : $('h1.text-large').text().trim(),
                URL : $('ul.list-unstyled > li > a').eq(0).text(),
                TOTAL_CAP_USD : $('span.text-large').text().replace('$','').replace(new RegExp(",","gm"),"")
            };
            aMarketList.push({
                i:oData.EXCHANGEID,
                n:oData.NAME_EN,
                b: false
            });
            pool.query('replace into exchanges set ?', oData, function (err, result) {
                if (err){
                    throw err
                }
                nCount2 ++;
                console.log("SQL Insert ["+nCount2+"/"+nMarket+"] ")
                if(nMarket == nCount2){
                    console.log("Exchange SQL insert process Finished.");
                    console.log("Saving data as Json.....");
                    saveJson();
                    var sJson =  JSON.stringify(aMarketList);
                    fs.writeFile("quickSearchMarket.json",sJson,function (err) {
                        if (err) throw err ;
                        console.log("Json File Saved !");
                    }) ;
                }
            });
            var aTableRows = $('#markets > table > tbody').children('tr'),
                sTimeStamp = new Date().getTime();
            aJson[sMarketId] = {
                'name': oData.NAME_EN,
                'cap' : oData.TOTAL_CAP_USD,
                'site' : oData.URL,
                'coinNum':aTableRows.length-1,
                'coins' : []
            };
            nTableRow = nTableRow + aTableRows.length - 1;
            for (var i = 1; i < aTableRows.length; i++) {
                var aTds = aTableRows.eq(i).children('td');
                var sCoinUrl = aTds.eq(1).children('a').attr('href');
                sCoinUrl = sCoinUrl.slice(0, sCoinUrl.length - 1);
                oData = {
                    COINID : sCoinUrl.slice(sCoinUrl.lastIndexOf('/') + 1),
                    EXCHANGEID : sMarketId,
                    PAIR: aTds.eq(2).children('a').text(),
                    VOLUME : aTds.eq(3).attr('data-usd'),
                    PRICE : aTds.eq(4).attr('data-usd'),
                    P24 : aTds.eq(5).text().replace('%','')
                };
                if(isNaN(oData.VOLUME)){
                    oData.VOLUME = 0;
                }
                if(isNaN(oData.PRICE)){
                    oData.PRICE = 0;
                }
               // console.log(oData.VOLUME);
                pool.query('replace into market set ?', oData, function (err, result) {
                    if (err){
                        throw err
                    }
                    queryCount++;
                    if(nMarket == nCount2 && queryCount == nTableRow){
                        console.log("====================================================================");
                        console.log("Market SQL insert process Finished.\n\nProcess Exit.");
                        console.log("====================================================================");
                        process.exit();
                    }
                });

                if(i < 11){
                    oCoin = {
                        'Id': oData.COINID,
                        'pair' : oData.PAIR,
                        'pairUrl' : aTds.eq(2).children('a').attr('href'),
                        'vol24' : oData.VOLUME,
                        'price': oData.PRICE,
                        'p24h' : oData.P24,
                        'update' : aTds.eq(6).text()
                    };
                    aJson[sMarketId]['coins'].push(oCoin);
                }
            }


        }else{
            console.log("Get "+sMarketId+" Failed:"+ error);
        }
        nCount ++ ;
        //console.log("["+nCount+"/"+nMarket+"] " +sMarketId);

        //saveJson();
    });
}

function saveJson() {
    var sJson =  JSON.stringify(aJson);
    fs.writeFile("market.json",sJson,function (err) {
        if (err) throw err ;
        console.log("Json File Saved !");
    }) ;
}