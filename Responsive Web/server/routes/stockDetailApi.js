const express = require('express');
const router = express.Router();
var request = require('request');
var parseString = require('xml2js').parseString;

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var moment = require('moment');
var moment_timezone = require('moment-timezone');

let mockDaily = {
  "Meta Data": {
    "1. Information": "Daily Prices (open, high, low, close) and Volumes",
    "2. Symbol": "aapl",
    "3. Last Refreshed": "2017-11-08 14:34:28",
    "4. Output Size": "Full size",
    "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
    "2017-11-08": {
      "1. open": "174.6600",
      "2. high": "176.0000",
      "3. low": "174.3300",
      "4. close": "175.9188",
      "5. volume": "16301189"
    },
    "2017-11-07": {
      "1. open": "173.9100",
      "2. high": "175.2500",
      "3. low": "173.6000",
      "4. close": "174.8100",
      "5. volume": "23910914"
    },
    "2017-11-06": {
      "1. open": "172.3700",
      "2. high": "174.9900",
      "3. low": "171.7200",
      "4. close": "174.2500",
      "5. volume": "34242566"
    }
  }};

const toMmDd = function(input) {
  const ptrn = /(\d{4})\-(\d{2})\-(\d{2})/;
  return input.replace(ptrn, '$2/$3');
};

//Todo: remove --- mock data
const random = function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* GET api listing. */
/* Get Basic Info */
router.get('/getBasicInfo', (req, res) => {
  const symbol = req.query.symbol;
  const options = {
    url: 'https://www.alphavantage.co/query?',
    qs: {
      function: "TIME_SERIES_DAILY",
      outputsize: "full",
      symbol: symbol,
      apikey: "3QZI4EXHIATYP6PJ"
    },
    method: 'GET'
  };
  let returnJson = {};
  returnJson["symbol"] = symbol.toUpperCase();
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let metaData = JSON.parse(body);
        //let metaData = mockDaily;
        if (metaData.hasOwnProperty("Error Message")) {
          returnJson["status"] = "error";
        }
        else {
          let dailyInfo = metaData["Time Series (Daily)"];
          if (dailyInfo) {
            let nowTime = moment_timezone.tz('America/New_York');
            let startTime = moment_timezone.tz('America/New_York').startOf('day').add(9, 'hours').add(30, 'minutes');
            let endTime = moment_timezone.tz('America/New_York').startOf('day').add(16, 'hours');

            let currentValue, openValue, previousCloseValue, changeValue, dayRange, volumnValue, timeStamp;
            returnJson["status"] = "success";
            let count = 0;
            let previous_close_set = false;
            for (key in dailyInfo) {
              if (count == 0) {

                let thisTime = moment_timezone.tz(key, 'America/New_York').startOf('day');
                let today = moment_timezone.tz('America/New_York').startOf('day');
                let thisCloseTime = moment_timezone.tz(key, 'America/New_York').startOf('day').add(16, 'hours');

                openValue = parseFloat(dailyInfo[key]["1. open"]);
                returnJson["open"] = openValue.toFixed(2);

                currentValue = parseFloat(dailyInfo[key]["4. close"]);
                returnJson["close"] = parseFloat(dailyInfo[key]["4. close"]).toFixed(2);

                returnJson["dayRange"] = parseFloat(dailyInfo[key]["3. low"]).toFixed(2) + "-" + parseFloat(dailyInfo[key]["2. high"]).toFixed(2);

                volumnValue = parseInt(dailyInfo[key]["5. volume"]);
                returnJson["volume"] = parseInt(dailyInfo[key]["5. volume"]).toLocaleString('en');

                if (thisTime.format() == today.format()
                  && nowTime.isBefore(endTime)
                  && nowTime.isAfter(startTime)) {
                  returnJson["timeStamp"] = nowTime.format('YYYY-MM-DD HH:mm:ss z');
                } else {
                  returnJson["timeStamp"] = thisCloseTime.format('YYYY-MM-DD HH:mm:ss z');
                  returnJson["last_close"] = returnJson["close"];
                  previous_close_set = true;
                }

              }
              if (count == 1) {
                if (!previous_close_set) {
                  returnJson["last_close"] = parseFloat(dailyInfo[key]["4. close"]).toFixed(2);
                }
                previousCloseValue = parseFloat(dailyInfo[key]["4. close"]);
                break;
              }
              ++count;
            }
            changeValue = currentValue - previousCloseValue;
            //console.log("change is " + currentValue + "---" + previousCloseValue);
            let changePercent = ((changeValue/previousCloseValue) * 100).toFixed(2) + "%";
            returnJson["isIncrease"] = changeValue > 0;
            returnJson["changeValue"] = changeValue.toFixed(2);
            returnJson["changePercent"] = changePercent;
            returnJson["favData"] = {
              symbol: symbol.toUpperCase(),
              isIncrease: changeValue > 0,
              close: currentValue,
              volume: volumnValue,
              volume_rep: returnJson["volume"],
              changeValue: changeValue,
              changePercent: (changeValue/previousCloseValue) * 100,
              changeString: returnJson["changeValue"] + "(" + changePercent + ")"
            };
          }
          else {
            returnJson["status"] = "error";
          }
        }
      }
      else {
        returnJson["status"] = "error";
      }
      res.send(returnJson);
    }
  );
});


/* GET api listing. */
/* Get Indicator Info */
router.get('/getIndicatorInfo', (req, res) => {
  const symbol = req.query.symbol;
  const indicator = req.query.indicator.toUpperCase();
  //https://www.alphavantage.co/query?function=MACD&symbol=aapl&outputsize=full&interval=daily&time_period=10&series_type=open&apikey=3QZI4EXHIATYP6PJ
  const options = {
    url: 'https://www.alphavantage.co/query?',
    qs: {
      function: indicator,
      symbol: symbol,
      outputsize: "full",
      interval: "daily",
      time_period: 10,
      series_type: "open",
      apikey: "3QZI4EXHIATYP6PJ"
    },
    method: 'GET'
  };
  let returnJson = {};
  returnJson["symbol"] = symbol.toUpperCase();
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let metaData = JSON.parse(body);
      if (metaData.hasOwnProperty("Error Message")) {
        returnJson["status"] = "error";
      }
      else {
        let techName = "Technical Analysis: " + indicator;
        let seriesValues = metaData[techName];
        if (seriesValues) {
          returnJson["status"] = "success";
          let count = 0;
          let series_arr = [];
          returnJson["series_arr"] = {};
          returnJson["series_categories"] = [];
          let sixMonthAgo = moment_timezone.tz('America/New_York').subtract(6, "months");
          //console.log("six-- " + sixMonthAgo);
          for (value in seriesValues) {
            let thisTime = moment_timezone.tz(value,'America/New_York');
            //console.log("thi time " + thisTime.format());
            returnJson["series_categories"].push(thisTime.format('MM/DD'));
            for (serieName in seriesValues[value]) {
              if (returnJson["series_arr"][serieName] == undefined) {
                returnJson["series_arr"][serieName] = [];
              }
              returnJson["series_arr"][serieName].push(parseFloat(seriesValues[value][serieName]));
            }
            if (sixMonthAgo.isAfter(thisTime)) break;
          }
        }
        else {
          returnJson["status"] = "error";
        }
      }
    }
    else {
      returnJson["status"] = "error";
    }
    res.send(returnJson);
  });
});


/* GET api listing. */
/* Get Historical Info */
router.get('/getHistorical', (req, res) => {
  const symbol = req.query.symbol;
  // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&apikey=3QZI4EXHIATYP6PJ&symbol=aaa
  const options = {
    url: 'https://www.alphavantage.co/query?',
    qs: {
      function: "TIME_SERIES_DAILY",
      outputsize: "full",
      symbol: symbol,
      apikey: "3QZI4EXHIATYP6PJ"
    },
    method: 'GET'
  };
  let returnJson = {};
  returnJson["symbol"] = symbol.toUpperCase();
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let metaData = JSON.parse(body);
      //console.log(metaData);
      if (metaData.hasOwnProperty("Error Message")) {
        returnJson["status"] = "error";
      }
      else {
        let dailyInfo = metaData["Time Series (Daily)"];
        if (dailyInfo) {
          returnJson["status"] = "success";
          let result = [];
          let count = 0;
          for (key in dailyInfo) {
            let thisTime = new Date(key);
            let pair = [thisTime.getTime(), parseFloat(dailyInfo[key]["4. close"]).toFixed(2)/1];
            result.unshift(pair);
            if (++count == 1000) break;
          }
          returnJson["result"] = result;
        }
        else {
          returnJson["status"] = "error";
        }
      }
    }
    else {
      returnJson["status"] = "error";
    }
    res.send(returnJson);
  });
});


/* GET api listing. */
/* Get News */
router.get('/getNews', (req, res) => {
  const symbol = req.query.symbol;
  const newsUrl = "https://seekingalpha.com/api/sa/combined/" + symbol + ".xml";
  const options = {
    url: newsUrl,
    method: 'GET'
  };
  const newsReg = /^https:\/\/seekingalpha.com\/article\/(.*)/;
  let returnJson = {};
  let feeds = [];
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        let count = 0;
        let items = result.rss['channel'][0]['item'];
        if (items) {
          for (let i = 0; i < items.length; ++i) {
            let itemJson = {};
            let news_link = items[i]['link'][0];
            if (newsReg.test(news_link)) {
              itemJson["title"] = items[i]['title'][0];
              itemJson["link"] = news_link;
              itemJson["pubDate"] = moment_timezone(items[i]['pubDate'][0])
                .tz('America/New_York')
                .format("ddd, DD MMM YYYY HH:mm:ss z");
              //let test = moment_timezone(itemJson["pubDate"]);
              //console.log(moment_timezone(itemJson["pubDate"]).tz('America/New_York').format("ddd, DD MMM YYYY HH:mm:ss z"));
              itemJson["author"] = items[i]["sa:author_name"][0];
              feeds.push(itemJson);
              if (++count == 5) break;
            }
          }
        }
      });
    }
    if (feeds.length == 0) {
      returnJson["status"] = "error";
    }
    else {
      returnJson["status"] = "success";
      returnJson["result"] = feeds;
    }
    res.send(returnJson);
  });
});


/* GET api listing. */
/* Get Basic Info */
router.get('/getPrice', (req, res) => {
  const symbol = req.query.symbol;
  const options = {
    url: 'https://www.alphavantage.co/query?',
    qs: {
      function: "TIME_SERIES_DAILY",
      outputsize: "full",
      symbol: symbol,
      apikey: "3QZI4EXHIATYP6PJ"
    },
    method: 'GET'
  };
  let returnJson = {};
  returnJson["symbol"] = symbol.toUpperCase();
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let metaData = JSON.parse(body);
      if (metaData.hasOwnProperty("Error Message")) {
        returnJson["status"] = "error";
      }
      else {
        returnJson["status"] = "success";
        let priceSeries = [];
        let volumnSeries = [];
        let series_categories = [];
        let dailyInfo = metaData["Time Series (Daily)"];
        let count = 0;
        let maxPrice = Number.MIN_VALUE;
        let minPrice = Number.MAX_VALUE;
        let minVolume = Number.MAX_VALUE;
        let maxVolume = Number.MIN_VALUE;
        let sixMonthAgo = moment_timezone().tz('America/New_York').subtract(6, "months");
        for (key in dailyInfo) {
            let thisTime = moment_timezone(key);
            series_categories.push(thisTime.format('MM/DD'));
            let thisPrice = dailyInfo[key]["4. close"];
            let thisVolume = dailyInfo[key]["5. volume"];
            maxPrice = thisPrice > maxPrice ? thisPrice : maxPrice;
            minPrice = thisPrice < minPrice ? thisPrice : minPrice;
            maxVolume = thisVolume > maxVolume ? thisVolume : maxVolume;
            minVolume = thisVolume < minVolume ? thisVolume : minVolume;
            priceSeries.push(parseFloat(thisPrice).toFixed(2)/1);
            volumnSeries.push(parseInt(thisVolume));
            if (sixMonthAgo.isAfter(thisTime)) break;
        }
        returnJson['price_series'] = priceSeries;
        returnJson['volume_series'] = volumnSeries;
        returnJson['maxPrice'] = parseFloat(maxPrice);
        returnJson['minPrice'] = parseFloat(minPrice);
        returnJson['maxVolume'] = parseInt(maxVolume);
        returnJson['minVolume'] = parseInt(minVolume);
        returnJson['series_categories'] = series_categories;
      }
    }
    else {
      returnJson["status"] = "error";
    }
    res.send(returnJson);
  });
});

module.exports = router;
