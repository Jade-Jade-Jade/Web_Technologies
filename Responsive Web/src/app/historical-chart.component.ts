import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { localDataService } from './local-data.service';
import { Subscription }   from 'rxjs/Subscription';
import { StockHighChart } from './StockHighChart'
//import * as Highcharts from 'highcharts';
import HighchartsExporting = require('highcharts/modules/exporting');
//HighchartsExporting(Highcharts);

import * as Highstock from 'highcharts/highstock';
HighchartsExporting(Highstock);

@Component({
  selector: 'historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.css']
})

export class HistoricalChartComponent {

  historicalData_subscription: Subscription;
  historicalData: any;
  historicalStatus: number = 0; //0 is fetching, 1 is success, 2 is error

  highChartDrawer: StockHighChart = new StockHighChart();

  constructor( private localDataService: localDataService ){
    this.historicalData_subscription = localDataService.historicalData$.subscribe(
      historicalData => {
        this.historicalData = historicalData;
        let historicalOption = this.highChartDrawer.getHisChartData(this.historicalData);
        if (historicalOption) {
          if (historicalOption == "error") {
            this.historicalStatus = 2;
          }
          else {
            this.historicalStatus = 1;
            Highstock.stockChart('historicalHighchart', historicalOption);
          }
        }
        else {
          this.historicalStatus = 0;
        }
      });

  };


}
