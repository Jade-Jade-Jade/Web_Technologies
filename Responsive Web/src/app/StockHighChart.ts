export class StockHighChart {

  prameters = {
    'SMA': {
      'multiple': false,
      'title': 'Simple Moving Average (SMA)',
      'yInterval': 2.5
    },
    'EMA': {
      'multiple': false,
      'title': 'Exponential Moving Average (EMA)',
      'yInterval': 2.5
    },
    'STOCH': {
      'multiple': true,
      'title': 'Stochastic Oscillator (STOCH)',
      'yInterval': 10
    },
    'RSI': {
      'multiple': false,
      'title': 'Relative Strength Index (RSI)',
      'yInterval': 10
    },
    'ADX': {
      'multiple': false,
      'title': 'Average Directional movement indeX (ADX)',
      'yInterval': 5
    },
    'CCI': {
      'multiple': false,
      'title': 'Commodity Channel Index (CCI)',
      'yInterval': 100
    },
    'BBANDS': {
      'multiple': true,
      'title': 'Bollinger Bands (BBANDS)',
      'yInterval': 5
    },
    'MACD': {
      'multiple': true,
      'title': 'Moving Average Convergence/Divergence (MACD)',
      'yInterval': 1
    }
  };

  getHisChartData(historicalData: any) {
      if (historicalData) {
        if (historicalData.status == 'success') {
          let historicalResult = historicalData['result'];
          if (historicalResult && historicalResult.length == 0) {
            return "error";
          }

          let historicalOption = {
            title: {
              text: historicalData['symbol'] + ' Stock Value'
            },
            subtitle: {
              useHTML: true,
              text: '<a target="_blank" style="color: blue" href="https://www.alphavantage.co">Source: Alpha Vantage</a>'
            },
            rangeSelector: {
              buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
              }, {
                type: 'month',
                count: 1,
                text: '1m'
              }, {
                type: 'month',
                count: 3,
                text: '3m'
              }, {
                type: 'month',
                count: 6,
                text: '6m'
              }, {
                type: 'ytd',
                count: 1,
                text: 'YTD'
              }, {
                type: 'year',
                count: 1,
                text: '1y'
              }, {
                type: 'all',
                count: 1,
                text: 'All'
              }],
              selected: 0
            },
            series: [{
              name: historicalData['symbol'],
              type: 'area',
              data: historicalResult,
              color: '#97C2E8',
              tooltip: [{
                valueDecimals: 2,
              }]
            }],
            tooltip:{
              split:false
            }
          };
          return historicalOption;
        }
        else {
          return "error";
        }
      }
      else {
        return null;
      }

  }

  getIndicatorData(indicatorData: any, idx: string) {

    if (indicatorData) {

      if (indicatorData.status == "success") {

        let symbol = indicatorData.symbol;
        let series_categories = indicatorData['series_categories'];
        let series_arr = indicatorData['series_arr'];

        if (series_arr && series_categories.length == 0) {
          return "error";
        }
        let count = 0;
        let series = [];
        for (let key in series_arr) {
          series[count++] = {
            name: this.prameters[idx]['multiple']? symbol + " " + key : symbol,
            data: series_arr[key]
          }
        }
        let indicatorOption = {
          chart: {
            zoomType: 'x',
            borderColor: 'lightGray',
            borderWidth: 1
          },
          title: {
            text: this.prameters[idx]['title']
          },
          subtitle: {
            useHTML: true,
            text: "<a target='_blank' href='https://www.alphavantage.co/'>Source: Alpha Vantage</a>"
          },
          xAxis: {
            type: 'datetime',
            categories: series_categories,
            tickInterval: 5,
            reversed: true
          },
          yAxis: {
            tickInterval: this.prameters[idx]['yInterval'],
            title: {
              text: idx
            }
          },
          series: series
        };
        return indicatorOption;
      }
      else {
        return "error";
      }
    }
    else {
      return null;
    }
  }

  getPriceData(priceData: any) {
    if (priceData) {
      if (priceData.status == 'success') {

        let series_categories = priceData['series_categories'];
        let price_series = priceData['price_series'];
        let volume_series = priceData['volume_series'];

        if (series_categories && series_categories.length == 0) {
          return "error";
        }

        let priceOption = {
          chart: {
            zoomType: 'x'
          },
          title: {
            text: priceData.symbol + " Stock Price and Volume"
          },
          subtitle: {
            useHTML: true,
            text: "<a target='_blank' href='https://www.alphavantage.co/'>Source: Alpha Vantage</a>"
          },
          yAxis: [
            {
              title: {
                text: "Stock Price",
                labels: {
                  format: "{value:,.0f}"
                },
                max: priceData.maxPrice,
                min: priceData.minPrice
              }
            },
            {
              title: {
                text: "Volume"
              },
              opposite: true,
              max: (priceData.maxVolume * 5)
            }
          ],
          xAxis: {
            type: "datetime",
            categories: series_categories,
            tickInterval: 5,
            reversed: true
          },
          plotOptions: {
            series: {
              allowPointSelect: true
            },
            column: {
              pointWidth: 2,
            },
            area: {
              fillColor: "#E2E2FF"
            }
          },
          series: [
            {
              type: "area",
              marker: {
                enabled: false
              },
              data: price_series,
              threshold: null,
              name: priceData['symbol'],
              tooltip: {
                valueDecimals: 2
              },
              color: "#0000FF"
            },
            {
              type: "column",
              data: volume_series,
              name: priceData['symbol'] + " Volume",
              yAxis: 1,
              borderWidth: 0.2,
              shadow: false,
              color: "#FF0000"
            }
          ]
        };
        return priceOption;
      }
      else {
        return "error";
      }
    }
    else {
      return null;
    }

  }

}
