import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { localDataService } from './local-data.service';
import { Subscription }   from 'rxjs/Subscription';
import { stateService } from './state.service';
import { StockHighChart } from './StockHighChart'


import * as Highcharts from 'highcharts';
import HighchartsExporting = require('highcharts/modules/exporting');
HighchartsExporting(Highcharts);


declare var FB:any;
declare var $:any;


@Component({
  selector: 'stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css'],
})

export class StockDetailComponent implements OnDestroy {
  basicInfo_subscription: Subscription;
  basicInfo: any;
  newsInfo_subscription: Subscription;
  newsInfo: any;

  currentContent = "stock";
  currentIndicator = "Price";

  smaData_subscription: Subscription;
  smaData: any;
  smaOption: any;

  emaData_subscription: Subscription;
  emaData: any;
  emaOption: any;


  stochData_subscription: Subscription;
  stochData: any;
  stochOption: any;


  rsiData_subscription: Subscription;
  rsiData: any;
  rsiOption: any;

  adxData_subscription: Subscription;
  adxData: any;
  adxOption: any;

  cciData_subscription: Subscription;
  cciData: any;
  cciOption: any;

  bbandsData: any;
  bbandsData_subscription: Subscription;
  bbandsOption: any;

  macdData: any;
  macdData_subscription: Subscription;
  macdOption: any;

  priceData: any;
  priceData_subscription: Subscription;
  priceOption: any;

  highChartDrawer: StockHighChart = new StockHighChart();

  isExistInLocal: boolean = false;

  isExistInLocal_subscription: Subscription;

  // 0 is fetching, 1 is success, 2 is error
  newsStatus: number = 0;
  basicInfoStatus: number = 0;

  ngOnInit() {
    if (this.basicInfo && this.basicInfo["status"] == "success" )
        this.isExistInLocal = this.localDataService.isExist(this.basicInfo['symbol']);
    else
        this.isExistInLocal = false;
    this.setBasicInfoStatus(this.basicInfo);
  }

  constructor(
    private localDataService: localDataService,
    private stateService: stateService
  ) {
    this.isExistInLocal_subscription = localDataService.localChange$.subscribe(
      localData => {
        if (this.basicInfo && this.basicInfo['symbol']) {
          this.isExistInLocal = this.localDataService.isExist(this.basicInfo['symbol']);
        }
        else {
          this.isExistInLocal = false;
        }
      });

    this.basicInfo_subscription = localDataService.currentStockBasicInfo$.subscribe(
      basicInfo => {
        this.basicInfo = basicInfo;
        if (this.basicInfo && this.basicInfo['symbol']) {
          this.isExistInLocal = this.localDataService.isExist(this.basicInfo['symbol']);
        }
        else {
          this.isExistInLocal = false;
        }
        this.setBasicInfoStatus(this.basicInfo);
      });
    this.newsInfo_subscription = localDataService.currentStockNews$.subscribe(
      newsInfo => {
        if (newsInfo) {
          if (newsInfo['status'] == 'error') {
            this.newsStatus = 2;
          }
          else {
            this.newsInfo = newsInfo['result'];
            this.newsStatus = 1;
          }
        }
        else {
          this.newsStatus = 0;
        }
      });
    this.priceData_subscription = localDataService.priceData$.subscribe(
      priceData => {
        this.priceData = priceData;
        this.priceOption = this.highChartDrawer.getPriceData(this.priceData);
      }
    );
    this.smaData_subscription = localDataService.smaData$.subscribe(
      smaData => {
        this.smaData = smaData;
        this.smaOption = this.highChartDrawer.getIndicatorData(smaData, 'SMA');
      });
    this.emaData_subscription = localDataService.emaData$.subscribe(
      emaData => {
        this.emaData = emaData;
        this.emaOption = this.highChartDrawer.getIndicatorData(emaData, 'EMA');
      });
    this.stochData_subscription = localDataService.stochData$.subscribe(
      stochData => {
        this.stochData = stochData;
        this.stochOption = this.highChartDrawer.getIndicatorData(stochData, 'STOCH');
      });
    this.rsiData_subscription = localDataService.rsiData$.subscribe(
      rsiData => {
        this.rsiData = rsiData;
        this.rsiOption = this.highChartDrawer.getIndicatorData(rsiData, 'RSI');
      });
    this.adxData_subscription = localDataService.adxData$.subscribe(
      adxData => {
        this.adxData = adxData;
        this.adxOption  = this.highChartDrawer.getIndicatorData(adxData, 'ADX');
      });
    this.cciData_subscription = localDataService.cciData$.subscribe(
      cciData => {
        this.cciData = cciData;
        this.cciOption = this.highChartDrawer.getIndicatorData(cciData, 'CCI');
      });
    this.bbandsData_subscription = localDataService.bbandsData$.subscribe(
      bbandsData => {
        this.bbandsData = bbandsData;
        this.bbandsOption = this.highChartDrawer.getIndicatorData(bbandsData, 'BBANDS');
      });
    this.macdData_subscription = localDataService.macdData$.subscribe(
      macdData => {
        this.macdData = macdData;
        this.macdOption = this.highChartDrawer.getIndicatorData(macdData, 'MACD');
      });
  }

  setToStock() {
    this.currentContent = "stock";
  }
  setToCharts() {
    this.currentContent = "chart";
  }
  setToNews() {
    this.currentContent = "news";
  }

  setIndicator(indicator: string) {
    this.currentIndicator = indicator;
  }

  switchToFav() {
    this.stateService.stateToLeft();
  }

  addToFav() {
    if (this.basicInfo && this.basicInfo["status"] == "success") {
      this.localDataService.addToLocal(this.basicInfo["favData"]);
    }
  }

  favAction() {
    if (!this.isExistInLocal) {
      this.localDataService.addToLocal(this.basicInfo["favData"]);
      this.isExistInLocal = true;
    }
    else {
      this.localDataService.removeFromLocal(this.basicInfo["symbol"]);
      this.isExistInLocal = false;
    }

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.basicInfo_subscription.unsubscribe();
  }

  getCurrentOption() {
    let thisOption = {};
    switch (this.currentIndicator) {
      case 'Price': thisOption = this.priceOption; break;
      case 'SMA': thisOption = this.smaOption; break;
      case 'EMA': thisOption = this.emaOption; break;
      case 'STOCH': thisOption = this.stochOption; break;
      case 'RSI': thisOption = this.rsiOption; break;
      case 'ADX': thisOption = this.adxOption; break;
      case 'CCI': thisOption = this.cciOption; break;
      case 'BBANDS': thisOption = this.bbandsOption; break;
      case 'MACD': thisOption = this.macdOption; break;
      default: break;
    }
    return thisOption;
  }

  isShareDisable() {
      let option = this.getCurrentOption();
      if (option && option != "error") return false;
      return true;
  }

  setBasicInfoStatus(basicInfo: any) {
    if (basicInfo) {
      if (basicInfo["status"] == "success")
        this.basicInfoStatus = 1;
      else
        this.basicInfoStatus = 2;
    }
    else this.basicInfoStatus = 0;
  }


  share() {
    const data = {
      options: JSON.stringify(this.getCurrentOption()),
      type: 'image/png',
      async: true
    };
    const exportUrl = 'http://export.highcharts.com/';
    $.post(exportUrl, data, (data) => {
      var url = exportUrl + data;
      this.postToFb(url);
    }).fail(function(response) {

    });
  }

  postToFb(url: string) {
    FB.ui({
      app_id: '1967546740125899',
      method: 'feed',
      caption: 'An example caption',
      picture: url
    }, (response) => {
      if (response && !response.error_message) {
        alert("Posted Successfully");
      } else {
        alert("Not Posted");
      }
    });
  }
}
