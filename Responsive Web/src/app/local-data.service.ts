import { Injectable, OnInit } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HttpClient } from '@angular/common/http';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class localDataService {

  private indicators = ['SMA', 'EMA', 'STOCH', 'RSI', 'ADX', 'CCI', 'BBANDS', 'MACD'];

  //private domain = 'http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com';
  private domain = '';

  private subject = new Subject<string>();
  subjectAnnounce$ = this.subject.asObservable();

  private currentStockBasicInfo = new Subject<any>();
  currentStockBasicInfo$ = this.currentStockBasicInfo.asObservable();
  private basicInfoApi = this.domain + "/stockDetailApi/getBasicInfo?";

  private currentStockNews = new Subject<any>();
  currentStockNews$ = this.currentStockNews.asObservable();
  private newsApi = this.domain + "/stockDetailApi/getNews?";

  private historicalData = new Subject<any>();
  historicalData$ = this.historicalData.asObservable();
  private historicalApi = this.domain + "/stockDetailApi/getHistorical?";

  private smaData = new Subject<any>();
  smaData$ = this.smaData.asObservable();

  private emaData = new Subject<any>();
  emaData$ = this.emaData.asObservable();

  private stochData = new Subject<any>();
  stochData$ = this.stochData.asObservable();

  private rsiData = new Subject<any>();
  rsiData$ = this.rsiData.asObservable();

  private adxData = new Subject<any>();
  adxData$ = this.adxData.asObservable();

  private cciData = new Subject<any>();
  cciData$ = this.cciData.asObservable();

  private bbandsData = new Subject<any>();
  bbandsData$ = this.bbandsData.asObservable();

  private macdData = new Subject<any>();
  macdData$ = this.macdData.asObservable();

  private indicatorApi = this.domain + "/stockDetailApi/getIndicatorInfo?";

  private priceData = new Subject<any>();
  priceData$ = this.priceData.asObservable();

  private priceApi = this.domain + "/stockDetailApi/getPrice?";


  private delectAction = new Subject<any>();
  delectAction$ = this.delectAction.asObservable();


  private localFlag = 1;
  private localChange = new Subject<any>();
  localChange$ = this.localChange.asObservable();
  //Todo: change to real api
  private localApi = this.domain + "/stockDetailApi/getMockData?";


  private initState = new Subject<boolean>();
  initState$ = this.initState.asObservable();

  constructor(private http: HttpClient){

  };

  isStart(state: boolean) {
    this.initState.next(state);
  }

  clearCurrentStockInfo() {
    this.currentStockBasicInfo.next(null);
    this.historicalData.next(null);
    this.priceData.next(null);
    this.smaData.next(null);
    this.emaData.next(null);
    this.stochData.next(null);
    this.rsiData.next(null);
    this.adxData.next(null);
    this.cciData.next(null);
    this.bbandsData.next(null);
    this.macdData.next(null);
  }

  sendLocalChange() {
    this.localFlag = ~this.localFlag;
    this.localChange.next(this.localFlag);
  }

  //isExist function!!!!!
  isExist(symbol: string) {
    let isExist = false;
    if (symbol) {
      let fav_list = JSON.parse(localStorage.getItem("fav_list"));
      if (fav_list) {
        for (let idx = 0; idx < fav_list.length; ++idx) {
          if (fav_list[idx]["symbol"] == symbol) {
            isExist = true;
          }
        }
      }
    }
    return isExist;
  }

  addToLocal(data: any) {
    let fav_list = JSON.parse(localStorage.getItem("fav_list"));
    let isExist = this.isExist(data["symbol"]) ;
    if (!isExist) {
      if (!fav_list) fav_list = [];
      fav_list.push(data);
      localStorage.setItem("fav_list", JSON.stringify(fav_list));
      this.sendLocalChange();
    }
  }

  removeFromLocal(symbol: string) {
    let fav_list = JSON.parse(localStorage.getItem("fav_list"));
    let idx = 0;
    for (; idx < fav_list.length; ++idx) {
        if (fav_list[idx]["symbol"] == symbol) break;
    }
    fav_list.splice(idx, 1);
    localStorage.setItem("fav_list", JSON.stringify(fav_list));
    this.delectAction.next(symbol);
    this.sendLocalChange();

  }

  resetLocal() {
    localStorage.removeItem("fav_list");
    this.sendLocalChange();
  }

  updateAllLocal() {
    let fav_list = JSON.parse(localStorage.getItem("fav_list"));
    let new_list = [];
    let count = 0;
    for (let fav in fav_list) {
      const params = new HttpParams()
        .set('symbol', fav_list[fav]['symbol']);
      this.http.get(this.basicInfoApi, {params}).subscribe(
        data => {
          new_list.push(data["favData"]);
          ++count;
          if (count == fav_list.length) {
              localStorage.setItem("fav_list", JSON.stringify(new_list));
              this.sendLocalChange();
          }
        }
      );
    }
  }

  fetchPriceData(currentStock: string) {
    const params = new HttpParams()
      .set('symbol', currentStock);
    this.http.get(this.priceApi, {params}).subscribe(
      data => {
          this.priceData.next(data);
      }
    );
  }

  fetchIndicatorsData(currentStock: string){
      for (let i = 0; i < this.indicators.length; ++i) {
          let params = new HttpParams()
            .set('symbol', currentStock)
            .set('indicator', this.indicators[i]);
          this.http.get(this.indicatorApi, {params}).subscribe(
            data => {
              this.sendIdxData(this.indicators[i], data);
            }
          );
      }
  }

  sendIdxData(idx: string, data: any) {
      switch (idx) {
          case 'SMA':
              this.smaData.next(data);
              break;
          case 'EMA':
              this.emaData.next(data);
              break;
          case 'STOCH':
              this.stochData.next(data);
              break;
          case 'RSI':
              this.rsiData.next(data);
              break;
          case 'ADX':
              this.adxData.next(data);
              break;
          case 'CCI':
              this.cciData.next(data);
              break;
          case 'BBANDS':
              this.bbandsData.next(data);
              break;
          case 'MACD':
              this.macdData.next(data);
              break;
          default:
              break;
      }
  }

  fetchHistoricalData(currentStock: string) {
    const params = new HttpParams().set('symbol', currentStock);
    this.http.get(this.historicalApi, {params}).subscribe(
      data => {
        this.sendHisData(data);
      }
    );
  }

  fetchBasicInfo(currentStock: string) {
    const params = new HttpParams().set('symbol', currentStock);
    this.http.get(this.basicInfoApi, {params}).subscribe(
      data => {
        this.sendBasicInfo(data);
      }
    );
  }

  fetchNews(currentStock: string) {
    const params = new HttpParams().set('symbol', currentStock);
    this.http.get(this.newsApi, {params}).subscribe(
      data => {
        this.sendNews(data);
      }
    );
  }

  refreshInfo(currentStock: string) {
    this.sendMessage(currentStock);
    this.fetchBasicInfo(currentStock);
    this.fetchNews(currentStock);
    this.fetchHistoricalData(currentStock);
    this.fetchIndicatorsData(currentStock);
    this.fetchPriceData(currentStock);
  }

  sendHisData(historicalData: any) {
    this.historicalData.next(historicalData);
  }

  sendBasicInfo(currentStockBasicInfo: any) {
    this.currentStockBasicInfo.next(currentStockBasicInfo);
  }

  sendNews(currentStockNews: any) {
    this.currentStockNews.next(currentStockNews);
  }

  sendMessage(currentStock: string) {
    this.subject.next(currentStock);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}
