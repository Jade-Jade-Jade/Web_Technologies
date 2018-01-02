import { Component, Input, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { stateService } from './state.service';
import { localDataService } from './local-data.service';
import { Subscription }   from 'rxjs/Subscription';


@Component({
  selector: 'favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})

export class FavoriteListComponent implements OnInit{

  private mockData: any;

  private isAutoOn: boolean;
  private autoInterval: any;

  private sortKey: string;
  private sortMethod: string;

  // Type: [{"symbol":"aaa","close":30800,"volume":598340,"changeValue":0,"changeString":"0.00(0.00%)"}]
  favData_subscription: Subscription;
  favData: any;

  toggleValue:boolean = false;

  toggle: any;

  toggles = [
    { value: 'toggled', display: 'Toggled' },
    { value: 'untoggled', display: 'UnToggled' },
  ];

  isStart: boolean = true;
  isStart_subscription: Subscription;

  constructor(
    private localDataService: localDataService,
    private stateService: stateService
  ){

    // Initialization - isAutoOn, localData
    this.isAutoOn = false;

    this.sortKey = "default";
    this.sortMethod = "Ascending";

    this.favData_subscription = localDataService.localChange$.subscribe(
      localData => {
        if (localStorage.getItem("fav_list")) {
          this.favData = JSON.parse(localStorage.getItem("fav_list"));
          if (this.sortKey != "default") {
            this.reSort(this.sortKey, this.sortMethod);
          }
        }
        else {
          this.favData = null;
        }
      });

    this.isStart_subscription = localDataService.initState$.subscribe(
      isStart => {
        this.isStart = isStart;
      }
    );

  }

  ngOnInit() {
    this.favData = JSON.parse(localStorage.getItem("fav_list"));
  }


  autoRefresh() {
    this.isAutoOn = !this.isAutoOn;
    //$('#my-toggle').bootstrapToggle();
    if (this.isAutoOn) {
      this.autoInterval = setInterval(()=> {
        this.updateAll();
      }, 5000);
    }
    else {
      clearInterval(this.autoInterval);
    }
  }

  // Refresh all data
  updateAll() {
    this.localDataService.updateAllLocal();
  }

  deleteStock(symbol: string) {
    this.localDataService.removeFromLocal(symbol);
  }

  sortByKey(array, key, asc) {
    array = array.sort(function(a, b) {
      let x = a[key]; let y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    return asc ? array : array.reverse();
  }

  reSort(key: string, asc: string) {
    let sortTag = asc == "Ascending"? true : false;
    this.favData = this.sortByKey(this.favData, key, sortTag);
  }

  setSortKey(key: string) {
    this.sortKey = key;
    if (this.sortKey != "default") {
      this.reSort(this.sortKey, this.sortMethod);
    }
  }

  setSortMethod(method: string) {
    this.sortMethod = method;
    if (this.sortKey != "default") {
      this.reSort(this.sortKey, this.sortMethod);
    }
  }

  switchToStock() {
    this.stateService.stateToRight();
  }

  getStockInfo(currentStock: string) {
    this.localDataService.clearCurrentStockInfo();
    this.localDataService.isStart(false);
    this.stateService.stateToRight();
    this.localDataService.refreshInfo(currentStock);
  }


}
