import { Component, OnInit } from '@angular/core';
import { autocompleteSearchService } from './autocomplete-search.service';
import { localDataService } from './local-data.service';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { FormControl, FormsModule, ReactiveFormsModule, Validators }    from '@angular/forms';
import { stateService } from './state.service';
import { Subscription }   from 'rxjs/Subscription';


import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'autocomplete-search',
  templateUrl: './autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.component.css'],
  providers: [autocompleteSearchService]
})


export class AutoCompleteSearchComponent implements OnInit {

  //private indicators = ['SMA', 'EMA', 'STOCH', 'RSI', 'ADX', 'CCI', 'BBANDS', 'MACD'];
  myControl: FormControl = new FormControl();
  isValid: boolean;
  inputSymbol = '';

  filteredOptions_subscription: Subscription;
  filteredOptions: any;

  constructor(
    private autocompleteSearchService: autocompleteSearchService,
    private localDataService: localDataService,
    private stateService: stateService
  ) {
    this.filteredOptions_subscription = autocompleteSearchService.symbolList$.subscribe(
      filteredOptions => {
        this.filteredOptions = filteredOptions;
      });
  }

  ngOnInit() {
  }

  getSymbolInfo() {
    this.localDataService.clearCurrentStockInfo();
    this.stateService.stateToRight();
    this.localDataService.isStart(false);
    const currentStock = this.inputSymbol;
    this.localDataService.refreshInfo(currentStock);
  }

  clearInfo() {
    this.filteredOptions = [];
    //this.localDataService.resetLocal();
    this.localDataService.isStart(true);
    this.localDataService.clearCurrentStockInfo();
    this.stateService.stateToLeft();
  }

  switchToStock() {
    this.stateService.stateToRight();
  }

  checkSymbol() {
    let typeIn = this.myControl.value;
    this.isValid = (typeIn.trim().length > 0)? true : false;
  }

  updateFilteredOptions() {
    if (this.myControl.value.length == 0) {
      this.filteredOptions = [];
    }
    if (this.isValid) {
      this.autocompleteSearchService.fetchSymbolList(this.myControl.value);
    }
  }
}


