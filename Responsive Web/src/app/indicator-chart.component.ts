import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { localDataService } from './local-data.service';
import { Subscription }   from 'rxjs/Subscription';
import { StockHighChart } from './StockHighChart'
import * as Highcharts from 'highcharts';
import HighchartsExporting = require('highcharts/modules/exporting');
HighchartsExporting(Highcharts);


@Component({
  selector: 'indicator-chart',
  templateUrl: './indicator-chart.component.html',
  styleUrls: ['./indicator-chart.component.css']
})

export class IndicatorChartComponent implements OnChanges {

  @Input() currentIndicator:string;
  @Input() priceOption:any;
  @Input() smaOption:any;
  @Input() emaOption:any;
  @Input() stochOption:any;
  @Input() rsiOption:any;
  @Input() adxOption:any;
  @Input() cciOption:any;
  @Input() bbandsOption:any;
  @Input() macdOption:any;


  indicators = ['SMA', 'EMA', 'STOCH', 'RSI', 'ADX', 'CCI', 'BBANDS', 'MACD'];

  oks = {
    'Price': 0,
    'SMA': 0,
    'EMA': 0,
    'STOCH': 0,
    'RSI': 0,
    'ADX': 0,
    'CCI': 0,
    'BBANDS': 0,
    'MACD': 0
  };

  highChartDrawer: StockHighChart = new StockHighChart();

  changeAction(change: string) {
    switch (change) {
      case "priceOption":
        if (this.priceOption) {
          if (this.priceOption == 'error') {
            this.oks['Price'] = 2;
          }
          else {
            this.oks['Price'] = 1;
            Highcharts.chart("Price", this.priceOption);
          }
        }
        else {
          this.oks['Price'] = 0;
        }
        break;
      case "smaOption":
        if (this.smaOption) {
          if (this.smaOption == 'error') {
            this.oks['SMA'] = 2;
          }
          else {
            this.oks['SMA'] = 1;
            Highcharts.chart("SMA", this.smaOption);
          }
        }
        else {
          this.oks['SMA'] = 0;
        }
        break;
      case "emaOption":
        if (this.emaOption) {
          if (this.emaOption == 'error') {
            this.oks['EMA'] = 2;
          }
          else {
            this.oks['EMA'] = 1;
            Highcharts.chart("EMA", this.emaOption);
          }
        }
        else  {
          this.oks['EMA'] = 0;
        }
        break;
      case "stochOption":
        if (this.stochOption){
          if (this.stochOption == 'error') {
            this.oks['STOCH'] = 2;
          }
          else {
            this.oks['STOCH'] = 1;
            Highcharts.chart("STOCH", this.stochOption);
          }
        }
        else {
          this.oks['STOCH'] = 0;
        }
        break;
      case "rsiOption":
        if (this.rsiOption) {
          if (this.rsiOption == 'error') {
            this.oks['RSI'] = 2;
          }
          else{
            this.oks['RSI'] = 1;
            Highcharts.chart("RSI", this.rsiOption);
          }
        }
        else {
          this.oks['RSI'] = 0;
        }
        break;
      case "adxOption":
        if (this.adxOption) {
          if (this.adxOption == 'error') {
            this.oks['ADX'] = 2;
          }
          else{
            this.oks['ADX'] = 1;
            Highcharts.chart("ADX", this.adxOption);
          }
        }
        else {
          this.oks['ADX'] = 0;
        }
        break;
      case "cciOption":
        if (this.cciOption) {
          if (this.cciOption == 'error') {
            this.oks['CCI'] = 2;
          }
          else{
            this.oks['CCI'] = 1;
            Highcharts.chart("CCI", this.cciOption);
          }
        }
        else {
          this.oks['CCI'] = 0;
        }
        break;
      case "bbandsOption":
        if (this.bbandsOption) {
          if (this.bbandsOption == 'error') {
            this.oks['BBANDS'] = 2;
          }
          else{
            this.oks['BBANDS'] = 1;
            Highcharts.chart("BBANDS", this.bbandsOption);
          }
        }
        else {
          this.oks['BBANDS'] = 0;
        }
        break;
      case "macdOption":
        if (this.macdOption) {
          if (this.macdOption == 'error') {
            this.oks['MACD'] = 2;
          }
          else{
            this.oks['MACD'] = 1;
            Highcharts.chart("MACD", this.macdOption);
          }
        }
        else {
          this.oks['MACD'] = 0;
        }
        break;
      default:
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let change in changes) {
      //some code here
      this.changeAction(change);
    }
  }

  ngOnInit() {
      const priceOption = {"chart":{"zoomType":"x"},"title":{"text":"Stock Price (11\/06\/2017)"},"subtitle":{"useHTML":true,"text":"Source: Alpha Vantage<\/a>"},"yAxis":[{"title":{"text":"Stock Price"},"labels":{"format":"{value:,.0f}"},"max":84.58,"min":67.48},{"title":{"text":"Volume"},"opposite":true,"max":283509400}],"xAxis":{"type":"datetime","categories":["11\/06","11\/03","11\/02","11\/01","10\/31","10\/30","10\/27","10\/26","10\/25","10\/24","10\/23","10\/20","10\/19","10\/18","10\/17","10\/16","10\/13","10\/12","10\/11","10\/10","10\/09","10\/06","10\/05","10\/04","10\/03","10\/02","09\/29","09\/28","09\/27","09\/26","09\/25","09\/22","09\/21","09\/20","09\/19","09\/18","09\/15","09\/14","09\/13","09\/12","09\/11","09\/08","09\/07","09\/06","09\/05","09\/01","08\/31","08\/30","08\/29","08\/28","08\/25","08\/24","08\/23","08\/22","08\/21","08\/18","08\/17","08\/16","08\/15","08\/14","08\/11","08\/10","08\/09","08\/08","08\/07","08\/04","08\/03","08\/02","08\/01","07\/31","07\/28","07\/27","07\/26","07\/25","07\/24","07\/21","07\/20","07\/19","07\/18","07\/17","07\/14","07\/13","07\/12","07\/11","07\/10","07\/07","07\/06","07\/05","07\/03","06\/30","06\/29","06\/28","06\/27","06\/26","06\/23","06\/22","06\/21","06\/20","06\/19","06\/16","06\/15","06\/14","06\/13","06\/12","06\/09","06\/08","06\/07","06\/06","06\/05","06\/02","06\/01","05\/31","05\/30","05\/26","05\/25","05\/24","05\/23","05\/22","05\/19","05\/18","05\/17","05\/16","05\/15","05\/12","05\/11","05\/10","05\/09","05\/08"],"tickInterval":5,"tickLength":0,"reversed":true},"series":[{"type":"area","marker":{"enabled":false},"data":[84.58,84.14,84.05,83.18,83.18,83.89,83.81,78.76,78.63,78.86,78.83,78.81,77.91,77.61,77.59,77.65,77.49,77.12,76.42,76.29,76.29,76,75.97,74.69,74.26,74.61,74.49,73.87,73.85,73.26,73.26,74.41,74.21,74.94,75.44,75.16,75.31,74.77,75.21,74.68,74.76,73.98,74.34,73.4,73.61,73.94,74.77,74.01,73.05,72.83,72.82,72.69,72.72,73.16,72.15,72.49,72.4,73.65,73.22,73.59,72.5,71.41,72.47,72.79,72.4,72.68,72.15,72.26,72.58,72.7,73.04,73.16,74.05,74.19,73.6,73.79,74.22,73.86,73.3,73.35,72.78,71.77,71.15,69.99,69.98,69.46,68.57,69.08,68.17,68.93,68.49,69.8,69.21,70.53,71.21,70.26,70.27,69.91,70.87,70,69.9,70.27,70.65,69.78,70.32,71.95,72.39,72.52,72.28,71.76,70.1,69.84,70.41,69.96,69.62,68.77,68.68,68.45,67.69,67.71,67.48,69.41,68.43,68.38,68.46,69.31,69.04,68.94],"threshold":null,"name":"MSFT","tooltip":{"valueDecimals":2}},{"type":"column","data":[12926796,17569120,23822964,22039635,26728947,31291801,70877350,29181652,19714512,16613928,20479731,22517092,14982129,13147124,15953665,12331147,15250772,16778148,14780652,13734627,11364275,13692791,20656238,13287346,11935853,15210338,16700435,10814063,18934048,17105469,23502422,13969937,19038998,20415084,15606870,22730355,37901927,15373384,12998629,14003880,17455115,14474383,17165518,15945136,21432599,21593192,26688077,16826094,11325418,14112777,12574503,15980144,13586784,14183146,17656716,18215276,21834250,17814317,17791179,19756773,21121250,23153711,20401071,21446993,18582345,22412719,17937522,26405096,19060885,23151962,17472880,35518251,15850344,21522189,20836422,45302930,34174677,21769229,26150272,21481069,25689303,20149208,17382861,16880205,14903400,15897154,20776555,20174523,16165500,23039328,28231562,25226070,24862560,19308122,23176418,22222851,19190623,20775590,23146852,46911637,25701569,25271276,24815455,47363986,48619420,23982410,21895156,31220057,29507429,34586054,21066468,29538356,16901792,19644260,21702912,14422965,15347877,15484530,26496478,24789790,29964198,33250702,30705323,17073013,27985424,17842038,22318181,18446053],"name":"MSFT Volume","yAxis":1,"borderWidth":0.2,"shadow":false}]};
      if (this.priceOption) Highcharts.chart("Price", this.priceOption);
      if (this.smaOption) Highcharts.chart("SMA", this.smaOption);
      if (this.emaOption) Highcharts.chart("EMA", this.emaOption);
      if (this.stochOption) Highcharts.chart("STOCH", this.stochOption);
      if (this.rsiOption) Highcharts.chart("RSI", this.rsiOption);
      if (this.adxOption) Highcharts.chart("ADX", this.adxOption);
      if (this.cciOption) Highcharts.chart("CCI", this.cciOption);
      if (this.bbandsOption) Highcharts.chart("BBANDS", this.bbandsOption);
      if (this.macdOption) Highcharts.chart("MACD", this.macdOption);
  }

  constructor( private localDataService: localDataService ){
  };

}
