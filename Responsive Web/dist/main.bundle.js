webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/StockHighChart.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StockHighChart = (function () {
    function StockHighChart() {
        this.prameters = {
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
    }
    StockHighChart.prototype.getHisChartData = function (historicalData) {
        if (historicalData) {
            if (historicalData.status == 'success') {
                var historicalResult = historicalData['result'];
                if (historicalResult && historicalResult.length == 0) {
                    return "error";
                }
                var historicalOption = {
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
                    tooltip: {
                        split: false
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
    };
    StockHighChart.prototype.getIndicatorData = function (indicatorData, idx) {
        if (indicatorData) {
            if (indicatorData.status == "success") {
                var symbol = indicatorData.symbol;
                var series_categories = indicatorData['series_categories'];
                var series_arr = indicatorData['series_arr'];
                if (series_arr && series_categories.length == 0) {
                    return "error";
                }
                var count = 0;
                var series = [];
                for (var key in series_arr) {
                    series[count++] = {
                        name: this.prameters[idx]['multiple'] ? symbol + " " + key : symbol,
                        data: series_arr[key]
                    };
                }
                var indicatorOption = {
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
    };
    StockHighChart.prototype.getPriceData = function (priceData) {
        if (priceData) {
            if (priceData.status == 'success') {
                var series_categories = priceData['series_categories'];
                var price_series = priceData['price_series'];
                var volume_series = priceData['volume_series'];
                if (series_categories && series_categories.length == 0) {
                    return "error";
                }
                var priceOption = {
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
    };
    return StockHighChart;
}());
exports.StockHighChart = StockHighChart;
//# sourceMappingURL=StockHighChart.js.map

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "hr {\n  border: 1px solid white;\n  max-width: 1280px;\n  margin: 20px auto;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <autocomplete-search></autocomplete-search>\n  <div><hr></div>\n  <result-form></result-form>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var state_service_1 = __webpack_require__("../../../../../src/app/state.service.ts");
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'Stock';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")],
        providers: [local_data_service_1.localDataService, state_service_1.stateService]
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var material_1 = __webpack_require__("../../../material/esm5/material.es5.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var animations_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser/animations.es5.js");
var app_component_1 = __webpack_require__("../../../../../src/app/app.component.ts");
var autocomplete_search_component_1 = __webpack_require__("../../../../../src/app/autocomplete-search.component.ts");
var result_form_component_1 = __webpack_require__("../../../../../src/app/result-form.component.ts");
var favorite_list_component_1 = __webpack_require__("../../../../../src/app/favorite-list.component.ts");
var stock_detail_component_1 = __webpack_require__("../../../../../src/app/stock-detail.component.ts");
var historical_chart_component_1 = __webpack_require__("../../../../../src/app/historical-chart.component.ts");
var indicator_chart_component_1 = __webpack_require__("../../../../../src/app/indicator-chart.component.ts");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpClientModule,
            animations_1.BrowserAnimationsModule,
            material_1.MatAutocompleteModule,
            material_1.MatFormFieldModule,
            material_1.MatInputModule,
            material_1.MatOptionModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        declarations: [
            app_component_1.AppComponent,
            autocomplete_search_component_1.AutoCompleteSearchComponent,
            result_form_component_1.ResultFormComponent,
            favorite_list_component_1.FavoriteListComponent,
            stock_detail_component_1.StockDetailComponent,
            historical_chart_component_1.HistoricalChartComponent,
            indicator_chart_component_1.IndicatorChartComponent
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/autocomplete-search.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/*.ng-untouched[required] {*/\n  /*border: 1px solid #a9a9a9; !* gray *!*/\n/*}*/\n/*.ng-touched[required] {*/\n  /*border: 1px solid #000fff; !* blue *!*/\n/*}*/\n/*.ng-valid[required], .ng-valid.required  {*/\n  /*border: 1px solid #42A948; !* green *!*/\n/*}*/\n/*.ng-invalid:not(form)  {*/\n  /*border: 1px solid #a94442; !* red *!*/\n/*}*/\n#search-container {\n  max-width: 1280px;\n  margin: 10px auto;\n  border-radius: 6px;\n  text-align: left;\n  padding: 15px;\n  background-color: #FFFFFF;\n}\n#autocomplete-container {\n  margin: 10px;\n}\n#label {\n  padding: 1px;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n#input {\n  padding: 1px;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n#button {\n  padding: 1px;\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.invalid  {\n  border: 1px solid red; /* red */\n}\n.valid  {\n  border: 1px solid blue; /* blue */\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/autocomplete-search.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"search-container\">\n  <div id=\"autocomplete-container\">\n      <h4 align=\"center\">Stock Market Search</h4>\n      <div class=\"row\">\n        <div id=\"label\" class=\"col-md-2 \">Enter Stock Ticker Symbol:<span class=\"text-danger\">*</span></div>\n        <form id=\"input\" #searchForm=\"ngForm\" class=\"form-inline\" class=\"col-md-6\">\n              <input #symbolInput required\n                     [(ngModel)]=\"inputSymbol\"\n                     (keyup)=\"checkSymbol(); updateFilteredOptions()\"\n                     placeholder=\"e.g AAPL\"\n                     aria-label=\"Option\"\n                     [matAutocomplete]=\"auto\"\n                     [formControl]=\"myControl\"\n                     [ngClass]=\"{'form-control':true, 'invalid': myControl.touched || !isValid, 'valid': myControl.untouched || isValid}\"\n              >\n              <div *ngIf=\"!isValid && (myControl.dirty || myControl.touched)\">\n                  Please enter a stock ticker symbol.\n              </div>\n              <mat-autocomplete #auto=\"matAutocomplete\">\n                <mat-option *ngFor=\"let option of filteredOptions\" [value]=\"option['Symbol']\">\n                  {{ option['Symbol']}} - {{ option['Name'] }} ({{ option['Exchange'] }})\n                </mat-option>\n              </mat-autocomplete>\n        </form>\n\n        <div id=\"button\" class=\"col-md-4\">\n          <button type=\"button\" class=\"btn btn-primary\" (click)=\"getSymbolInfo()\" [disabled]=\"!myControl.touched || !isValid\">\n            <i class=\"fa fa-search\" aria-hidden=\"true\"></i> Get Quote\n          </button>\n          <button type=\"button\" class=\"btn btn-default\" (click)=\"clearInfo(); myControl.reset()\">\n            <i class=\"fa fa-refresh\" aria-hidden=\"true\"></i> Clear\n          </button>\n        </div>\n\n      </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/autocomplete-search.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var autocomplete_search_service_1 = __webpack_require__("../../../../../src/app/autocomplete-search.service.ts");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var state_service_1 = __webpack_require__("../../../../../src/app/state.service.ts");
__webpack_require__("../../../../rxjs/_esm5/add/operator/startWith.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
__webpack_require__("../../../../rxjs/_esm5/add/observable/of.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/catch.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/debounceTime.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/distinctUntilChanged.js");
var AutoCompleteSearchComponent = (function () {
    function AutoCompleteSearchComponent(autocompleteSearchService, localDataService, stateService) {
        var _this = this;
        this.autocompleteSearchService = autocompleteSearchService;
        this.localDataService = localDataService;
        this.stateService = stateService;
        //private indicators = ['SMA', 'EMA', 'STOCH', 'RSI', 'ADX', 'CCI', 'BBANDS', 'MACD'];
        this.myControl = new forms_1.FormControl();
        this.inputSymbol = '';
        this.filteredOptions_subscription = autocompleteSearchService.symbolList$.subscribe(function (filteredOptions) {
            _this.filteredOptions = filteredOptions;
        });
    }
    AutoCompleteSearchComponent.prototype.ngOnInit = function () {
    };
    AutoCompleteSearchComponent.prototype.getSymbolInfo = function () {
        this.localDataService.clearCurrentStockInfo();
        this.stateService.stateToRight();
        this.localDataService.isStart(false);
        var currentStock = this.inputSymbol;
        this.localDataService.refreshInfo(currentStock);
    };
    AutoCompleteSearchComponent.prototype.clearInfo = function () {
        this.filteredOptions = [];
        //this.localDataService.resetLocal();
        this.localDataService.isStart(true);
        this.localDataService.clearCurrentStockInfo();
        this.stateService.stateToLeft();
    };
    AutoCompleteSearchComponent.prototype.switchToStock = function () {
        this.stateService.stateToRight();
    };
    AutoCompleteSearchComponent.prototype.checkSymbol = function () {
        var typeIn = this.myControl.value;
        this.isValid = (typeIn.trim().length > 0) ? true : false;
    };
    AutoCompleteSearchComponent.prototype.updateFilteredOptions = function () {
        if (this.myControl.value.length == 0) {
            this.filteredOptions = [];
        }
        if (this.isValid) {
            this.autocompleteSearchService.fetchSymbolList(this.myControl.value);
        }
    };
    return AutoCompleteSearchComponent;
}());
AutoCompleteSearchComponent = __decorate([
    core_1.Component({
        selector: 'autocomplete-search',
        template: __webpack_require__("../../../../../src/app/autocomplete-search.component.html"),
        styles: [__webpack_require__("../../../../../src/app/autocomplete-search.component.css")],
        providers: [autocomplete_search_service_1.autocompleteSearchService]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof autocomplete_search_service_1.autocompleteSearchService !== "undefined" && autocomplete_search_service_1.autocompleteSearchService) === "function" && _a || Object, typeof (_b = typeof local_data_service_1.localDataService !== "undefined" && local_data_service_1.localDataService) === "function" && _b || Object, typeof (_c = typeof state_service_1.stateService !== "undefined" && state_service_1.stateService) === "function" && _c || Object])
], AutoCompleteSearchComponent);
exports.AutoCompleteSearchComponent = AutoCompleteSearchComponent;
var _a, _b, _c;
//# sourceMappingURL=autocomplete-search.component.js.map

/***/ }),

/***/ "../../../../../src/app/autocomplete-search.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var Subject_1 = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var http_2 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var autocompleteSearchService = (function () {
    function autocompleteSearchService(http) {
        this.http = http;
        //private domain = 'http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com';
        this.domain = '';
        this.symbolApi = this.domain + '/guessSymbolApi'; // URL to web api - remember to remove when complete
        this.symbolList = new Subject_1.Subject();
        this.symbolList$ = this.symbolList.asObservable();
    }
    ;
    autocompleteSearchService.prototype.fetchSymbolList = function (currenTypeIn) {
        var _this = this;
        var params = new http_2.HttpParams()
            .set('input', currenTypeIn);
        this.http.get(this.symbolApi, { params: params }).subscribe(function (data) {
            _this.symbolList.next(data);
        });
    };
    return autocompleteSearchService;
}());
autocompleteSearchService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], autocompleteSearchService);
exports.autocompleteSearchService = autocompleteSearchService;
var _a;
//# sourceMappingURL=autocomplete-search.service.js.map

/***/ }),

/***/ "../../../../../src/app/favorite-list.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#nav_fav-list {\n  background-color: #EAEAEA;\n  display: flow-root;\n}\n#title_fav-list {\n\n}\n#sort_fav-list {\n  max-width: 100%;\n}\n#fav_symbol {\n  color: blue;\n}\n#table_fav-list {\n  width: 100%;\n}\n.upTick {\n  max-height: 6%;\n  height: 18px;\n}\n.downTick {\n  max-height: 4%;\n  height: 16px;\n}\n.red {\n  color: red;\n}\n.green {\n  color: green;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/favorite-list.component.html":
/***/ (function(module, exports) {

module.exports = "<!--<nav id=\"nav\" class=\"navbar navbar-light\">-->\n  <!--&lt;!&ndash; Navbar content &ndash;&gt;-->\n<!--</nav>-->\n<div class=\"list-group\">\n  <div id=\"nav_fav-list\" class=\"list-group-item\">\n    <span id=\"title_fav-list\">Favorite List</span>\n    <span class=\"pull-right\">\n        <span class=\"hidden-xs hidden-sm\">Automatic Refresh</span>\n        <label (click)=\"autoRefresh()\"><input type=\"checkbox\" data-toggle=\"toggle\" id=\"my-toggle\"></label>\n        <button type=\"button\" class=\"btn btn-default\" aria-label=\"Left Align\" (click)=\"updateAll()\">\n          <span class=\"glyphicon glyphicon-refresh\" aria-hidden=\"true\"></span>\n        </button>\n        <button [disabled]=\"isStart\" type=\"button\" class=\"btn btn-default\" (click)=\"switchToStock()\">\n          <span class=\"glyphicon glyphicon-menu-right\"></span>\n        </button>\n    </span>\n  </div>\n  <div id=\"sort_fav-list\" class=\"list-group-item container\">\n    <div class=\"row\">\n      <div class=\"col-md-1 col-xs-12 pull-left\">\n        <span>Sort by</span>\n      </div>\n      <div class=\"form-group col-md-3 col-xs-12 pull-left\">\n        <select class=\"form-control\" (change)=\"setSortKey($event.target.value)\">\n          <option value=\"default\">Default</option>\n          <option value=\"symbol\">Symbol</option>\n          <option value=\"close\">Price</option>\n          <option value=\"changeValue\">Change</option>\n          <option value=\"changePercent\">Change Percent</option>\n          <option value=\"volume\">Volume</option>\n        </select>\n      </div>\n      <div class=\"col-md-1 col-xs-12 pull-left\">\n        <span>Order</span>\n      </div>\n      <div class=\"form-group col-md-3 col-xs-12 pull-left\">\n        <select [disabled]=\"sortKey == 'default'\" class=\"form-control\" (change)=\"setSortMethod($event.target.value)\">\n          <option value=\"Ascending\">Ascending</option>\n          <option value=\"Descending\">Descending</option>\n        </select>\n      </div>\n    </div>\n    <div id=\"table_fav-list\" class=\"table-responsive\">\n      <table class=\"table table-striped\">\n        <tbody>\n          <tr>\n            <th>Symbol</th>\n            <th>Stock Price</th>\n            <th>Change(Change Percent)</th>\n            <th>Volume</th>\n            <th></th>\n          </tr>\n          <ng-container *ngFor=\"let fav of favData\">\n            <tr>\n              <th id=\"fav_symbol\" class=\"clickable-symbol\" scope=\"row\" (click)=\"getStockInfo(fav['symbol'])\" >{{fav['symbol']}}</th>\n              <td>{{fav['close']}}</td>\n              <td>\n                <span [ngClass]=\"{'text-warning':fav['isIncrease'] == false, 'text-success':fav['isIncrease'] == true}\">{{fav['changeString']}}</span>\n                <img [hidden]=\"fav['isIncrease'] == false\" src=\"http://cs-server.usc.edu:45678/hw/hw8/images/Up.png\" class=\"upTick\">\n                <img [hidden]=\"fav['isIncrease'] == true\" src=\"http://cs-server.usc.edu:45678/hw/hw8/images/Down.png\" class=\"downTick\">\n              </td>\n              <td>{{fav['volume_rep']}}</td>\n              <td>\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"deleteStock(fav['symbol'])\"><span class=\"glyphicon glyphicon-trash\"></span></button>\n              </td>\n            </tr>\n          </ng-container>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/favorite-list.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var state_service_1 = __webpack_require__("../../../../../src/app/state.service.ts");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var FavoriteListComponent = (function () {
    function FavoriteListComponent(localDataService, stateService) {
        var _this = this;
        this.localDataService = localDataService;
        this.stateService = stateService;
        this.toggleValue = false;
        this.toggles = [
            { value: 'toggled', display: 'Toggled' },
            { value: 'untoggled', display: 'UnToggled' },
        ];
        this.isStart = true;
        // Initialization - isAutoOn, localData
        this.isAutoOn = false;
        this.sortKey = "default";
        this.sortMethod = "Ascending";
        this.favData_subscription = localDataService.localChange$.subscribe(function (localData) {
            if (localStorage.getItem("fav_list")) {
                _this.favData = JSON.parse(localStorage.getItem("fav_list"));
                if (_this.sortKey != "default") {
                    _this.reSort(_this.sortKey, _this.sortMethod);
                }
            }
            else {
                _this.favData = null;
            }
        });
        this.isStart_subscription = localDataService.initState$.subscribe(function (isStart) {
            _this.isStart = isStart;
        });
    }
    FavoriteListComponent.prototype.ngOnInit = function () {
        this.favData = JSON.parse(localStorage.getItem("fav_list"));
    };
    FavoriteListComponent.prototype.autoRefresh = function () {
        var _this = this;
        this.isAutoOn = !this.isAutoOn;
        //$('#my-toggle').bootstrapToggle();
        if (this.isAutoOn) {
            this.autoInterval = setInterval(function () {
                _this.updateAll();
            }, 5000);
        }
        else {
            clearInterval(this.autoInterval);
        }
    };
    // Refresh all data
    FavoriteListComponent.prototype.updateAll = function () {
        this.localDataService.updateAllLocal();
    };
    FavoriteListComponent.prototype.deleteStock = function (symbol) {
        this.localDataService.removeFromLocal(symbol);
    };
    FavoriteListComponent.prototype.sortByKey = function (array, key, asc) {
        array = array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return asc ? array : array.reverse();
    };
    FavoriteListComponent.prototype.reSort = function (key, asc) {
        var sortTag = asc == "Ascending" ? true : false;
        this.favData = this.sortByKey(this.favData, key, sortTag);
    };
    FavoriteListComponent.prototype.setSortKey = function (key) {
        this.sortKey = key;
        if (this.sortKey != "default") {
            this.reSort(this.sortKey, this.sortMethod);
        }
    };
    FavoriteListComponent.prototype.setSortMethod = function (method) {
        this.sortMethod = method;
        if (this.sortKey != "default") {
            this.reSort(this.sortKey, this.sortMethod);
        }
    };
    FavoriteListComponent.prototype.switchToStock = function () {
        this.stateService.stateToRight();
    };
    FavoriteListComponent.prototype.getStockInfo = function (currentStock) {
        this.localDataService.clearCurrentStockInfo();
        this.localDataService.isStart(false);
        this.stateService.stateToRight();
        this.localDataService.refreshInfo(currentStock);
    };
    return FavoriteListComponent;
}());
FavoriteListComponent = __decorate([
    core_1.Component({
        selector: 'favorite-list',
        template: __webpack_require__("../../../../../src/app/favorite-list.component.html"),
        styles: [__webpack_require__("../../../../../src/app/favorite-list.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof local_data_service_1.localDataService !== "undefined" && local_data_service_1.localDataService) === "function" && _a || Object, typeof (_b = typeof state_service_1.stateService !== "undefined" && state_service_1.stateService) === "function" && _b || Object])
], FavoriteListComponent);
exports.FavoriteListComponent = FavoriteListComponent;
var _a, _b;
//# sourceMappingURL=favorite-list.component.js.map

/***/ }),

/***/ "../../../../../src/app/historical-chart.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#historical_progress {\n  margin: 12%;\n}\n#historical_error {\n  margin: 12%;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/historical-chart.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n<div [hidden]=\"historicalStatus != 0\" class=\"progress\" id=\"historical_progress\">\n  <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width: 50%\" aria-valuenow=\"10\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n</div>\n<div [hidden]=\"historicalStatus != 1\" id=\"historicalHighchart\"></div>\n<div [hidden]=\"historicalStatus != 2\" id=\"historical_error\">\n  <div class=\"alert alert-danger\" role=\"alert\">\n    Error! Failed to get historical charts data\n  </div>\n</div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/historical-chart.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var StockHighChart_1 = __webpack_require__("../../../../../src/app/StockHighChart.ts");
//import * as Highcharts from 'highcharts';
var HighchartsExporting = __webpack_require__("../../../../highcharts/modules/exporting.js");
//HighchartsExporting(Highcharts);
var Highstock = __webpack_require__("../../../../highcharts/highstock.js");
HighchartsExporting(Highstock);
var HistoricalChartComponent = (function () {
    function HistoricalChartComponent(localDataService) {
        var _this = this;
        this.localDataService = localDataService;
        this.historicalStatus = 0; //0 is fetching, 1 is success, 2 is error
        this.highChartDrawer = new StockHighChart_1.StockHighChart();
        this.historicalData_subscription = localDataService.historicalData$.subscribe(function (historicalData) {
            _this.historicalData = historicalData;
            var historicalOption = _this.highChartDrawer.getHisChartData(_this.historicalData);
            if (historicalOption) {
                if (historicalOption == "error") {
                    _this.historicalStatus = 2;
                }
                else {
                    _this.historicalStatus = 1;
                    Highstock.stockChart('historicalHighchart', historicalOption);
                }
            }
            else {
                _this.historicalStatus = 0;
            }
        });
    }
    ;
    return HistoricalChartComponent;
}());
HistoricalChartComponent = __decorate([
    core_1.Component({
        selector: 'historical-chart',
        template: __webpack_require__("../../../../../src/app/historical-chart.component.html"),
        styles: [__webpack_require__("../../../../../src/app/historical-chart.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof local_data_service_1.localDataService !== "undefined" && local_data_service_1.localDataService) === "function" && _a || Object])
], HistoricalChartComponent);
exports.HistoricalChartComponent = HistoricalChartComponent;
var _a;
//# sourceMappingURL=historical-chart.component.js.map

/***/ }),

/***/ "../../../../../src/app/indicator-chart.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#highchartContainer {\n  max-width: 100%;\n}\n.priceProgress {\n  margin-top: 16%;\n  margin-bottom: 16%;\n}\n.error-alert {\n  margin-top: 14%;\n  margin-bottom: 14%;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/indicator-chart.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"highchartContainer\">\n  <div [hidden]=\"currentIndicator != 'Price'\">\n    <div [hidden]=\"oks['Price'] != 1\" id=\"Price\"></div>\n    <div [hidden]=\"oks['Price'] != 0\" class=\"progress priceProgress\">\n      <div class=\"progress-bar progress-bar-striped active\"\n           role=\"progressbar\"\n           style=\"width: 50%\"\n           aria-valuenow=\"20\"\n           aria-valuemin=\"0\"\n           aria-valuemax=\"100\"\n      >\n      </div>\n    </div>\n    <div [hidden]=\"oks['Price'] != 2\" class=\"error-alert\">\n      <div class=\"alert alert-danger\" role=\"alert\">\n        Error! Failed to get Price data\n      </div>\n    </div>\n  </div>\n\n  <div *ngFor=\"let indicator of indicators\">\n    <div [hidden]=\"currentIndicator != indicator\">\n      <div [hidden]=\"oks[indicator] != 1\" id={{indicator}}></div>\n      <div [hidden]=\"oks[indicator] != 0\" class=\"progress priceProgress\">\n        <div class=\"progress-bar progress-bar-striped active\"\n             role=\"progressbar\"\n             style=\"width: 50%\"\n             aria-valuenow=\"20\"\n             aria-valuemin=\"0\"\n             aria-valuemax=\"100\"\n        >\n        </div>\n      </div>\n      <div [hidden]=\"oks[indicator] != 2\" class=\"error-alert\">\n        <div class=\"alert alert-danger\" role=\"alert\">\n          Error! Failed to get {{indicator}} data\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n\n<!--<div id=\"highchartContainer\">-->\n  <!--<div [hidden]=\"currentIndicator != 'Price'\" id=\"Price\">-->\n    <!--<div class=\"progress priceProgress\">-->\n      <!--<div class=\"progress-bar progress-bar-striped active\"-->\n           <!--role=\"progressbar\"-->\n           <!--style=\"width: 50%\"-->\n           <!--aria-valuenow=\"20\"-->\n           <!--aria-valuemin=\"0\"-->\n           <!--aria-valuemax=\"100\"-->\n      <!--&gt;-->\n      <!--</div>-->\n    <!--</div>-->\n  <!--</div>-->\n\n  <!--<div [hidden]=\"currentIndicator != 'SMA'\" id=\"SMA\">-->\n    <!--<div class=\"progress priceProgress\">-->\n      <!--<div class=\"progress-bar progress-bar-striped active\"-->\n           <!--role=\"progressbar\"-->\n           <!--style=\"width: 50%\"-->\n           <!--aria-valuenow=\"20\"-->\n           <!--aria-valuemin=\"0\"-->\n           <!--aria-valuemax=\"100\"-->\n      <!--&gt;-->\n      <!--</div>-->\n    <!--</div>-->\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'EMA'\" id=\"EMA\">-->\n    <!--<div class=\"progress priceProgress\">-->\n      <!--<div class=\"progress-bar progress-bar-striped active\"-->\n           <!--role=\"progressbar\"-->\n           <!--style=\"width: 50%\"-->\n           <!--aria-valuenow=\"20\"-->\n           <!--aria-valuemin=\"0\"-->\n           <!--aria-valuemax=\"100\"-->\n      <!--&gt;-->\n      <!--</div>-->\n    <!--</div>-->\n\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'STOCH'\" id=\"STOCH\">-->\n    <!--<div class=\"progress priceProgress\">-->\n      <!--<div class=\"progress-bar progress-bar-striped active\"-->\n           <!--role=\"progressbar\"-->\n           <!--style=\"width: 50%\"-->\n           <!--aria-valuenow=\"20\"-->\n           <!--aria-valuemin=\"0\"-->\n           <!--aria-valuemax=\"100\"-->\n      <!--&gt;-->\n      <!--</div>-->\n    <!--</div>-->\n\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'RSI'\" id=\"RSI\">-->\n\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'ADX'\" id=\"ADX\">-->\n\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'CCI'\" id=\"CCI\">-->\n\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'BBANDS'\" id=\"BBANDS\">-->\n\n  <!--</div>-->\n  <!--<div [hidden]=\"currentIndicator != 'MACD'\" id=\"MACD\">-->\n\n  <!--</div>-->\n<!--</div>-->\n"

/***/ }),

/***/ "../../../../../src/app/indicator-chart.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var StockHighChart_1 = __webpack_require__("../../../../../src/app/StockHighChart.ts");
var Highcharts = __webpack_require__("../../../../highcharts/highcharts.js");
var HighchartsExporting = __webpack_require__("../../../../highcharts/modules/exporting.js");
HighchartsExporting(Highcharts);
var IndicatorChartComponent = (function () {
    function IndicatorChartComponent(localDataService) {
        this.localDataService = localDataService;
        this.indicators = ['SMA', 'EMA', 'STOCH', 'RSI', 'ADX', 'CCI', 'BBANDS', 'MACD'];
        this.oks = {
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
        this.highChartDrawer = new StockHighChart_1.StockHighChart();
    }
    IndicatorChartComponent.prototype.changeAction = function (change) {
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
                else {
                    this.oks['EMA'] = 0;
                }
                break;
            case "stochOption":
                if (this.stochOption) {
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
                    else {
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
                    else {
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
                    else {
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
                    else {
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
                    else {
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
    };
    IndicatorChartComponent.prototype.ngOnChanges = function (changes) {
        for (var change in changes) {
            //some code here
            this.changeAction(change);
        }
    };
    IndicatorChartComponent.prototype.ngOnInit = function () {
        var priceOption = { "chart": { "zoomType": "x" }, "title": { "text": "Stock Price (11\/06\/2017)" }, "subtitle": { "useHTML": true, "text": "Source: Alpha Vantage<\/a>" }, "yAxis": [{ "title": { "text": "Stock Price" }, "labels": { "format": "{value:,.0f}" }, "max": 84.58, "min": 67.48 }, { "title": { "text": "Volume" }, "opposite": true, "max": 283509400 }], "xAxis": { "type": "datetime", "categories": ["11\/06", "11\/03", "11\/02", "11\/01", "10\/31", "10\/30", "10\/27", "10\/26", "10\/25", "10\/24", "10\/23", "10\/20", "10\/19", "10\/18", "10\/17", "10\/16", "10\/13", "10\/12", "10\/11", "10\/10", "10\/09", "10\/06", "10\/05", "10\/04", "10\/03", "10\/02", "09\/29", "09\/28", "09\/27", "09\/26", "09\/25", "09\/22", "09\/21", "09\/20", "09\/19", "09\/18", "09\/15", "09\/14", "09\/13", "09\/12", "09\/11", "09\/08", "09\/07", "09\/06", "09\/05", "09\/01", "08\/31", "08\/30", "08\/29", "08\/28", "08\/25", "08\/24", "08\/23", "08\/22", "08\/21", "08\/18", "08\/17", "08\/16", "08\/15", "08\/14", "08\/11", "08\/10", "08\/09", "08\/08", "08\/07", "08\/04", "08\/03", "08\/02", "08\/01", "07\/31", "07\/28", "07\/27", "07\/26", "07\/25", "07\/24", "07\/21", "07\/20", "07\/19", "07\/18", "07\/17", "07\/14", "07\/13", "07\/12", "07\/11", "07\/10", "07\/07", "07\/06", "07\/05", "07\/03", "06\/30", "06\/29", "06\/28", "06\/27", "06\/26", "06\/23", "06\/22", "06\/21", "06\/20", "06\/19", "06\/16", "06\/15", "06\/14", "06\/13", "06\/12", "06\/09", "06\/08", "06\/07", "06\/06", "06\/05", "06\/02", "06\/01", "05\/31", "05\/30", "05\/26", "05\/25", "05\/24", "05\/23", "05\/22", "05\/19", "05\/18", "05\/17", "05\/16", "05\/15", "05\/12", "05\/11", "05\/10", "05\/09", "05\/08"], "tickInterval": 5, "tickLength": 0, "reversed": true }, "series": [{ "type": "area", "marker": { "enabled": false }, "data": [84.58, 84.14, 84.05, 83.18, 83.18, 83.89, 83.81, 78.76, 78.63, 78.86, 78.83, 78.81, 77.91, 77.61, 77.59, 77.65, 77.49, 77.12, 76.42, 76.29, 76.29, 76, 75.97, 74.69, 74.26, 74.61, 74.49, 73.87, 73.85, 73.26, 73.26, 74.41, 74.21, 74.94, 75.44, 75.16, 75.31, 74.77, 75.21, 74.68, 74.76, 73.98, 74.34, 73.4, 73.61, 73.94, 74.77, 74.01, 73.05, 72.83, 72.82, 72.69, 72.72, 73.16, 72.15, 72.49, 72.4, 73.65, 73.22, 73.59, 72.5, 71.41, 72.47, 72.79, 72.4, 72.68, 72.15, 72.26, 72.58, 72.7, 73.04, 73.16, 74.05, 74.19, 73.6, 73.79, 74.22, 73.86, 73.3, 73.35, 72.78, 71.77, 71.15, 69.99, 69.98, 69.46, 68.57, 69.08, 68.17, 68.93, 68.49, 69.8, 69.21, 70.53, 71.21, 70.26, 70.27, 69.91, 70.87, 70, 69.9, 70.27, 70.65, 69.78, 70.32, 71.95, 72.39, 72.52, 72.28, 71.76, 70.1, 69.84, 70.41, 69.96, 69.62, 68.77, 68.68, 68.45, 67.69, 67.71, 67.48, 69.41, 68.43, 68.38, 68.46, 69.31, 69.04, 68.94], "threshold": null, "name": "MSFT", "tooltip": { "valueDecimals": 2 } }, { "type": "column", "data": [12926796, 17569120, 23822964, 22039635, 26728947, 31291801, 70877350, 29181652, 19714512, 16613928, 20479731, 22517092, 14982129, 13147124, 15953665, 12331147, 15250772, 16778148, 14780652, 13734627, 11364275, 13692791, 20656238, 13287346, 11935853, 15210338, 16700435, 10814063, 18934048, 17105469, 23502422, 13969937, 19038998, 20415084, 15606870, 22730355, 37901927, 15373384, 12998629, 14003880, 17455115, 14474383, 17165518, 15945136, 21432599, 21593192, 26688077, 16826094, 11325418, 14112777, 12574503, 15980144, 13586784, 14183146, 17656716, 18215276, 21834250, 17814317, 17791179, 19756773, 21121250, 23153711, 20401071, 21446993, 18582345, 22412719, 17937522, 26405096, 19060885, 23151962, 17472880, 35518251, 15850344, 21522189, 20836422, 45302930, 34174677, 21769229, 26150272, 21481069, 25689303, 20149208, 17382861, 16880205, 14903400, 15897154, 20776555, 20174523, 16165500, 23039328, 28231562, 25226070, 24862560, 19308122, 23176418, 22222851, 19190623, 20775590, 23146852, 46911637, 25701569, 25271276, 24815455, 47363986, 48619420, 23982410, 21895156, 31220057, 29507429, 34586054, 21066468, 29538356, 16901792, 19644260, 21702912, 14422965, 15347877, 15484530, 26496478, 24789790, 29964198, 33250702, 30705323, 17073013, 27985424, 17842038, 22318181, 18446053], "name": "MSFT Volume", "yAxis": 1, "borderWidth": 0.2, "shadow": false }] };
        if (this.priceOption)
            Highcharts.chart("Price", this.priceOption);
        if (this.smaOption)
            Highcharts.chart("SMA", this.smaOption);
        if (this.emaOption)
            Highcharts.chart("EMA", this.emaOption);
        if (this.stochOption)
            Highcharts.chart("STOCH", this.stochOption);
        if (this.rsiOption)
            Highcharts.chart("RSI", this.rsiOption);
        if (this.adxOption)
            Highcharts.chart("ADX", this.adxOption);
        if (this.cciOption)
            Highcharts.chart("CCI", this.cciOption);
        if (this.bbandsOption)
            Highcharts.chart("BBANDS", this.bbandsOption);
        if (this.macdOption)
            Highcharts.chart("MACD", this.macdOption);
    };
    ;
    return IndicatorChartComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], IndicatorChartComponent.prototype, "currentIndicator", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "priceOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "smaOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "emaOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "stochOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "rsiOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "adxOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "cciOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "bbandsOption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], IndicatorChartComponent.prototype, "macdOption", void 0);
IndicatorChartComponent = __decorate([
    core_1.Component({
        selector: 'indicator-chart',
        template: __webpack_require__("../../../../../src/app/indicator-chart.component.html"),
        styles: [__webpack_require__("../../../../../src/app/indicator-chart.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof local_data_service_1.localDataService !== "undefined" && local_data_service_1.localDataService) === "function" && _a || Object])
], IndicatorChartComponent);
exports.IndicatorChartComponent = IndicatorChartComponent;
var _a;
//# sourceMappingURL=indicator-chart.component.js.map

/***/ }),

/***/ "../../../../../src/app/local-data.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var Subject_1 = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var http_2 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var localDataService = (function () {
    function localDataService(http) {
        this.http = http;
        this.indicators = ['SMA', 'EMA', 'STOCH', 'RSI', 'ADX', 'CCI', 'BBANDS', 'MACD'];
        //private domain = 'http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com';
        this.domain = '';
        this.subject = new Subject_1.Subject();
        this.subjectAnnounce$ = this.subject.asObservable();
        this.currentStockBasicInfo = new Subject_1.Subject();
        this.currentStockBasicInfo$ = this.currentStockBasicInfo.asObservable();
        this.basicInfoApi = this.domain + "/stockDetailApi/getBasicInfo?";
        this.currentStockNews = new Subject_1.Subject();
        this.currentStockNews$ = this.currentStockNews.asObservable();
        this.newsApi = this.domain + "/stockDetailApi/getNews?";
        this.historicalData = new Subject_1.Subject();
        this.historicalData$ = this.historicalData.asObservable();
        this.historicalApi = this.domain + "/stockDetailApi/getHistorical?";
        this.smaData = new Subject_1.Subject();
        this.smaData$ = this.smaData.asObservable();
        this.emaData = new Subject_1.Subject();
        this.emaData$ = this.emaData.asObservable();
        this.stochData = new Subject_1.Subject();
        this.stochData$ = this.stochData.asObservable();
        this.rsiData = new Subject_1.Subject();
        this.rsiData$ = this.rsiData.asObservable();
        this.adxData = new Subject_1.Subject();
        this.adxData$ = this.adxData.asObservable();
        this.cciData = new Subject_1.Subject();
        this.cciData$ = this.cciData.asObservable();
        this.bbandsData = new Subject_1.Subject();
        this.bbandsData$ = this.bbandsData.asObservable();
        this.macdData = new Subject_1.Subject();
        this.macdData$ = this.macdData.asObservable();
        this.indicatorApi = this.domain + "/stockDetailApi/getIndicatorInfo?";
        this.priceData = new Subject_1.Subject();
        this.priceData$ = this.priceData.asObservable();
        this.priceApi = this.domain + "/stockDetailApi/getPrice?";
        this.delectAction = new Subject_1.Subject();
        this.delectAction$ = this.delectAction.asObservable();
        this.localFlag = 1;
        this.localChange = new Subject_1.Subject();
        this.localChange$ = this.localChange.asObservable();
        //Todo: change to real api
        this.localApi = this.domain + "/stockDetailApi/getMockData?";
        this.initState = new Subject_1.Subject();
        this.initState$ = this.initState.asObservable();
    }
    ;
    localDataService.prototype.isStart = function (state) {
        this.initState.next(state);
    };
    localDataService.prototype.clearCurrentStockInfo = function () {
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
    };
    localDataService.prototype.sendLocalChange = function () {
        this.localFlag = ~this.localFlag;
        this.localChange.next(this.localFlag);
    };
    //isExist function!!!!!
    localDataService.prototype.isExist = function (symbol) {
        var isExist = false;
        if (symbol) {
            var fav_list = JSON.parse(localStorage.getItem("fav_list"));
            if (fav_list) {
                for (var idx = 0; idx < fav_list.length; ++idx) {
                    if (fav_list[idx]["symbol"] == symbol) {
                        isExist = true;
                    }
                }
            }
        }
        return isExist;
    };
    localDataService.prototype.addToLocal = function (data) {
        var fav_list = JSON.parse(localStorage.getItem("fav_list"));
        var isExist = this.isExist(data["symbol"]);
        if (!isExist) {
            if (!fav_list)
                fav_list = [];
            fav_list.push(data);
            localStorage.setItem("fav_list", JSON.stringify(fav_list));
            this.sendLocalChange();
        }
    };
    localDataService.prototype.removeFromLocal = function (symbol) {
        var fav_list = JSON.parse(localStorage.getItem("fav_list"));
        var idx = 0;
        for (; idx < fav_list.length; ++idx) {
            if (fav_list[idx]["symbol"] == symbol)
                break;
        }
        fav_list.splice(idx, 1);
        localStorage.setItem("fav_list", JSON.stringify(fav_list));
        this.delectAction.next(symbol);
        this.sendLocalChange();
    };
    localDataService.prototype.resetLocal = function () {
        localStorage.removeItem("fav_list");
        this.sendLocalChange();
    };
    localDataService.prototype.updateAllLocal = function () {
        var _this = this;
        var fav_list = JSON.parse(localStorage.getItem("fav_list"));
        var new_list = [];
        var count = 0;
        for (var fav in fav_list) {
            var params = new http_2.HttpParams()
                .set('symbol', fav_list[fav]['symbol']);
            this.http.get(this.basicInfoApi, { params: params }).subscribe(function (data) {
                new_list.push(data["favData"]);
                ++count;
                if (count == fav_list.length) {
                    localStorage.setItem("fav_list", JSON.stringify(new_list));
                    _this.sendLocalChange();
                }
            });
        }
    };
    localDataService.prototype.fetchPriceData = function (currentStock) {
        var _this = this;
        var params = new http_2.HttpParams()
            .set('symbol', currentStock);
        this.http.get(this.priceApi, { params: params }).subscribe(function (data) {
            _this.priceData.next(data);
        });
    };
    localDataService.prototype.fetchIndicatorsData = function (currentStock) {
        var _this = this;
        var _loop_1 = function (i) {
            var params = new http_2.HttpParams()
                .set('symbol', currentStock)
                .set('indicator', this_1.indicators[i]);
            this_1.http.get(this_1.indicatorApi, { params: params }).subscribe(function (data) {
                _this.sendIdxData(_this.indicators[i], data);
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.indicators.length; ++i) {
            _loop_1(i);
        }
    };
    localDataService.prototype.sendIdxData = function (idx, data) {
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
    };
    localDataService.prototype.fetchHistoricalData = function (currentStock) {
        var _this = this;
        var params = new http_2.HttpParams().set('symbol', currentStock);
        this.http.get(this.historicalApi, { params: params }).subscribe(function (data) {
            _this.sendHisData(data);
        });
    };
    localDataService.prototype.fetchBasicInfo = function (currentStock) {
        var _this = this;
        var params = new http_2.HttpParams().set('symbol', currentStock);
        this.http.get(this.basicInfoApi, { params: params }).subscribe(function (data) {
            _this.sendBasicInfo(data);
        });
    };
    localDataService.prototype.fetchNews = function (currentStock) {
        var _this = this;
        var params = new http_2.HttpParams().set('symbol', currentStock);
        this.http.get(this.newsApi, { params: params }).subscribe(function (data) {
            _this.sendNews(data);
        });
    };
    localDataService.prototype.refreshInfo = function (currentStock) {
        this.sendMessage(currentStock);
        this.fetchBasicInfo(currentStock);
        this.fetchNews(currentStock);
        this.fetchHistoricalData(currentStock);
        this.fetchIndicatorsData(currentStock);
        this.fetchPriceData(currentStock);
    };
    localDataService.prototype.sendHisData = function (historicalData) {
        this.historicalData.next(historicalData);
    };
    localDataService.prototype.sendBasicInfo = function (currentStockBasicInfo) {
        this.currentStockBasicInfo.next(currentStockBasicInfo);
    };
    localDataService.prototype.sendNews = function (currentStockNews) {
        this.currentStockNews.next(currentStockNews);
    };
    localDataService.prototype.sendMessage = function (currentStock) {
        this.subject.next(currentStock);
    };
    localDataService.prototype.clearMessage = function () {
        this.subject.next();
    };
    localDataService.prototype.getMessage = function () {
        return this.subject.asObservable();
    };
    return localDataService;
}());
localDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], localDataService);
exports.localDataService = localDataService;
var _a;
//# sourceMappingURL=local-data.service.js.map

/***/ }),

/***/ "../../../../../src/app/result-form.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#result-container {\n  max-width: 1280px;\n  margin: 10px auto;\n  border-radius: 6px;\n  text-align: left;\n  padding: 15px;\n  background-color: #FFFFFF;\n  overflow: hidden;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/result-form.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"result-container\">\n    <div [@infoState]=\"infoState\"><stock-detail></stock-detail></div>\n    <div [@favState]=\"favState\"><favorite-list></favorite-list></div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/result-form.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var state_service_1 = __webpack_require__("../../../../../src/app/state.service.ts");
var animations_1 = __webpack_require__("../../../animations/@angular/animations.es5.js");
var ResultFormComponent = (function () {
    function ResultFormComponent(localDataService, stateService) {
        var _this = this;
        this.localDataService = localDataService;
        this.stateService = stateService;
        this.favState = "left";
        this.infoState = "left";
        this.testLocal = localStorage.getItem('localTest');
        this.subscription = localDataService.subjectAnnounce$.subscribe(function (currentSymbol) {
            _this.currentSymbol = currentSymbol;
        });
        this.favState_subscription = stateService.favoriteState$.subscribe(function (favState) {
            _this.favState = favState;
        });
        this.infoState_subscription = stateService.stockDetailState$.subscribe(function (infoState) {
            _this.infoState = infoState;
        });
    }
    ResultFormComponent.prototype.ngOnDestroy = function () {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    };
    return ResultFormComponent;
}());
ResultFormComponent = __decorate([
    core_1.Component({
        selector: 'result-form',
        template: __webpack_require__("../../../../../src/app/result-form.component.html"),
        styles: [__webpack_require__("../../../../../src/app/result-form.component.css")],
        animations: [
            animations_1.trigger('favState', [
                animations_1.state('left', animations_1.style({
                    'display': 'block',
                })),
                animations_1.state('right', animations_1.style({
                    'display': 'none'
                })),
                animations_1.transition('right => left', [
                    animations_1.style({ transform: 'translateX(100%)' }),
                    animations_1.animate(1000)
                ])
            ]),
            animations_1.trigger('infoState', [
                animations_1.state('left', animations_1.style({
                    'display': 'none',
                })),
                animations_1.state('right', animations_1.style({
                    'display': 'block'
                })),
                animations_1.transition('left => right', [
                    animations_1.style({ transform: 'translateX(-100%)' }),
                    animations_1.animate(1000)
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof local_data_service_1.localDataService !== "undefined" && local_data_service_1.localDataService) === "function" && _a || Object, typeof (_b = typeof state_service_1.stateService !== "undefined" && state_service_1.stateService) === "function" && _b || Object])
], ResultFormComponent);
exports.ResultFormComponent = ResultFormComponent;
var _a, _b;
//# sourceMappingURL=result-form.component.js.map

/***/ }),

/***/ "../../../../../src/app/state.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var Subject_1 = __webpack_require__("../../../../rxjs/_esm5/Subject.js");
var stateService = (function () {
    function stateService() {
        this.favoriteState = new Subject_1.Subject();
        this.favoriteState$ = this.favoriteState.asObservable();
        this.stockDetailState = new Subject_1.Subject();
        this.stockDetailState$ = this.stockDetailState.asObservable();
    }
    stateService.prototype.stateToLeft = function () {
        this.favoriteState.next("left");
        this.stockDetailState.next("left");
    };
    stateService.prototype.stateToRight = function () {
        this.favoriteState.next("right");
        this.stockDetailState.next("right");
    };
    return stateService;
}());
stateService = __decorate([
    core_1.Injectable()
], stateService);
exports.stateService = stateService;
//# sourceMappingURL=state.service.js.map

/***/ }),

/***/ "../../../../../src/app/stock-detail.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/* change all .btn to .btn-sm size on xs */\n#nav_stock-detail {\n  background-color: #EAEAEA;\n  display: flow-root;\n  text-align: center;\n}\n#content_stock-detail {\n  max-width: 100%;\n}\n#fb-logo {\n  width: 20px;\n  height: 20px;\n}\n.stockDetail_container {\n  padding: 2%;\n}\n#basicInfo_header {\n  margin-bottom: 2%;\n}\n#basicInfo_button{\n  margin-bottom: 2%;\n}\n#basicInfo_progress{\n  margin-top: 25%;\n  margin-bottom: 25%;\n}\n#basicInfo_error{\n  margin-top: 23%;\n  margin-bottom: 20%;\n}\n#newsInfo_progress {\n  margin: 10%;\n}\n#basicInfo_content {\n  margin-top: 11%;\n}\n.upTick {\n  max-height: 6%;\n  height: 18px;\n}\n.downTick {\n  max-height: 4%;\n  height: 18px;\n}\n.newsContent {\n  margin-top: 2%;\n  margin-bottom: 2%;\n}\n@media(max-width: 990px) {\n  .visable{\n    display:none;\n  }\n}\n.glyphicon-star {\n  color: #FED531;\n}\n\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/stock-detail.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"list-group\">\n\n  <div id=\"nav_stock-detail\" class=\"list-group-item\">\n    <span class=\"pull-left\">\n        <button type=\"button\" class=\"btn btn-default\" (click)=\"switchToFav()\">\n          <span class=\"glyphicon glyphicon-menu-left\"></span>\n        </button>\n    </span>\n    <span id=\"title_stock-detail\"><h4>Stock Details</h4></span>\n  </div>\n\n  <div id=\"content_stock-detail\" class=\"list-group-item container\">\n\n    <!-- navigation bar-->\n    <ul class=\"nav nav-pills list-inline\">\n      <li [ngClass]=\"{'clickable-symbol':true,'active': currentContent == 'stock'}\" (click)=\"setToStock()\"><a><span class=\"glyphicon glyphicon-time\"></span> <span class=\"visable\">Current</span> Stock</a></li>\n      <li [ngClass]=\"{'clickable-symbol':true,'active': currentContent == 'chart'}\" (click)=\"setToCharts()\"><a><span class=\"glyphicon glyphicon-stats\"></span> <span class=\"visable\">Historical</span> Charts</a></li>\n      <li [ngClass]=\"{'clickable-symbol':true,'active': currentContent == 'news'}\" (click)=\"setToNews()\"><a><span class=\"glyphicon glyphicon-link\"> </span>News<span class=\"visable\">Feeds</span></a></li>\n    </ul>\n\n    <hr>\n\n    <!-- Current Stock-->\n    <div [hidden]=\"currentContent != 'stock'\" class=\"row\">\n\n      <!-- basicInfo bar-->\n      <div class=\"col-md-6 stockDetail_container\">\n\n        <div class=\"row\" id=\"basicInfo_header\">\n          <h5 class=\"col-md-6 pull-left\">\n            Stock Details\n          </h5>\n          <div class=\"col-md-6\">\n            <div class=\"pull-right\">\n              <!--favorite button-->\n              <button [disabled]=\"basicInfoStatus != 1\" type=\"button\" class=\"btn btn-default\" (click)=\"favAction()\">\n                <span [ngClass]=\"{'glyphicon': true, 'glyphicon-star': isExistInLocal, 'glyphicon-star-empty': !isExistInLocal}\" class=\"glyphicon glyphicon-star-empty\" aria-hidden=\"true\"></span>\n              </button>\n              <button [disabled]=\"isShareDisable()\" type=\"button\" class=\"btn btn-default\" (click)=\"share()\">\n                <img id=\"fb-logo\" src=\"http://cs-server.usc.edu:45678/hw/hw8/images/facebook.png\"/>\n              </button>\n            </div>\n          </div>\n        </div>\n\n        <div [hidden]=\"basicInfoStatus != 2\" id=\"basicInfo_error\">\n          <div class=\"alert alert-danger\" role=\"alert\">\n            Error! Failed to get Current Stock data\n          </div>\n        </div>\n\n        <div [hidden]=\"basicInfoStatus != 0\" class=\"progress\" id=\"basicInfo_progress\">\n          <div class=\"progress-bar progress-bar-striped active\"\n               role=\"progressbar\"\n               style=\"width: 50%\"\n               aria-valuenow=\"20\"\n               aria-valuemin=\"0\"\n               aria-valuemax=\"100\"\n          >\n          </div>\n        </div>\n\n        <table [hidden]=\"basicInfoStatus != 1\" *ngIf=\"basicInfo\" class=\"table table-striped\" id=\"basicInfo_content\">\n          <tbody>\n            <tr>\n              <th scope=\"row\" class=\"col-xs-4 col-md-6\">Stock Ticker Symbol</th>\n              <td>{{ basicInfo['symbol'] }}</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Last Price</th>\n              <td>{{ basicInfo['close'] }}</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Change(Change Percent)</th>\n              <td *ngIf=\"basicInfo['isIncrease'] == true\" class=\"text-success\">\n                {{ basicInfo['changeValue'] }} ({{ basicInfo['changePercent'] }})\n                <img src=\"http://cs-server.usc.edu:45678/hw/hw8/images/Up.png\" class=\"upTick\">\n              </td>\n              <td *ngIf=\"basicInfo['isIncrease'] == false\" class=\"text-warning\">\n                {{ basicInfo['changeValue'] }} ({{ basicInfo['changePercent'] }})\n                <img src=\"http://cs-server.usc.edu:45678/hw/hw8/images/Down.png\" class=\"downTick\">\n              </td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Timestamp</th>\n              <td>{{ basicInfo['timeStamp'] }}</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Open</th>\n              <td>{{ basicInfo['open'] }}</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Close</th>\n              <td>{{ basicInfo['last_close'] }}</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Day's Range</th>\n              <td>{{ basicInfo['dayRange'] }}</td>\n            </tr>\n            <tr>\n              <th scope=\"row\">Volume</th>\n              <td>{{ basicInfo['volume'] }}</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <!--HighChart Indicators Section-->\n      <div class=\"col-md-6 stockDetail_container\">\n        <div>\n          <ul class=\"nav nav-tabs\" role=\"tablist\">\n            <li (click)=\"setIndicator('Price')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='Price'}\"><a>Price</a></li>\n            <li (click)=\"setIndicator('SMA')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='SMA'}\"><a>SMA</a></li>\n            <li (click)=\"setIndicator('EMA')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='EMA'}\" ><a>EMA</a></li>\n            <li (click)=\"setIndicator('STOCH')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='STOCH'}\" ><a>STOCH</a></li>\n            <li (click)=\"setIndicator('RSI')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='RSI'}\" ><a>RSI</a></li>\n            <li (click)=\"setIndicator('ADX')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='ADX'}\" ><a>ADX</a></li>\n            <li (click)=\"setIndicator('CCI')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='CCI'}\" ><a>CCI</a></li>\n            <li (click)=\"setIndicator('BBANDS')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='BBANDS'}\" ><a>BBANDS</a></li>\n            <li (click)=\"setIndicator('MACD')\" [ngClass]=\"{'clickable-symbol':true, 'active': this.currentIndicator=='MACD'}\" ><a>MACD</a></li>\n          </ul>\n        </div>\n        <indicator-chart\n          [currentIndicator]=\"currentIndicator\"\n          [priceOption]=\"priceOption\"\n          [smaOption]=\"smaOption\"\n          [emaOption]=\"emaOption\"\n          [stochOption]=\"stochOption\"\n          [rsiOption]=\"rsiOption\"\n          [adxOption]=\"adxOption\"\n          [cciOption]=\"cciOption\"\n          [bbandsOption]=\"bbandsOption\"\n          [macdOption]=\"macdOption\"\n        ></indicator-chart>\n      </div>\n\n\n    </div>\n    <!-- Historical Chart-->\n    <div [hidden]=\"currentContent != 'chart'\" class=\"stockDetail_container\">\n      <historical-chart></historical-chart>\n    </div>\n\n\n    <!-- News Feed-->\n    <div [hidden]=\"currentContent != 'news'\" class=\"stockDetail_container\">\n      \n      <div [hidden]=\"newsStatus != 0\" class=\"progress\" id=\"newsInfo_progress\">\n        <div class=\"progress-bar progress-bar-striped active\"\n             role=\"progressbar\"\n             style=\"width: 50%\"\n             aria-valuenow=\"10\"\n             aria-valuemin=\"0\"\n             aria-valuemax=\"100\"\n        >\n        </div>\n      </div>\n\n      <div [hidden]=\"newsStatus != 2\">\n        <div class=\"alert alert-danger\" role=\"alert\">\n          Error! Failed to get News feed data\n        </div>\n      </div>\n\n      <div [hidden]=\"newsStatus != 1\" *ngIf=\"newsInfo\">\n        <div *ngFor=\"let news of newsInfo\">\n          <div class=\"well\">\n              <h4><a target=\"_blank\" href={{news.link}}>{{news.title}}</a></h4>\n              <div class=\"newsContent\">\n                <h5>Author:  {{news.author}}</h5>\n                <h5>Date: {{news.pubDate}}</h5>\n              </div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/stock-detail.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var local_data_service_1 = __webpack_require__("../../../../../src/app/local-data.service.ts");
var state_service_1 = __webpack_require__("../../../../../src/app/state.service.ts");
var StockHighChart_1 = __webpack_require__("../../../../../src/app/StockHighChart.ts");
var Highcharts = __webpack_require__("../../../../highcharts/highcharts.js");
var HighchartsExporting = __webpack_require__("../../../../highcharts/modules/exporting.js");
HighchartsExporting(Highcharts);
var StockDetailComponent = (function () {
    function StockDetailComponent(localDataService, stateService) {
        var _this = this;
        this.localDataService = localDataService;
        this.stateService = stateService;
        this.currentContent = "stock";
        this.currentIndicator = "Price";
        this.highChartDrawer = new StockHighChart_1.StockHighChart();
        this.isExistInLocal = false;
        // 0 is fetching, 1 is success, 2 is error
        this.newsStatus = 0;
        this.basicInfoStatus = 0;
        this.isExistInLocal_subscription = localDataService.localChange$.subscribe(function (localData) {
            if (_this.basicInfo && _this.basicInfo['symbol']) {
                _this.isExistInLocal = _this.localDataService.isExist(_this.basicInfo['symbol']);
            }
            else {
                _this.isExistInLocal = false;
            }
        });
        this.basicInfo_subscription = localDataService.currentStockBasicInfo$.subscribe(function (basicInfo) {
            _this.basicInfo = basicInfo;
            if (_this.basicInfo && _this.basicInfo['symbol']) {
                _this.isExistInLocal = _this.localDataService.isExist(_this.basicInfo['symbol']);
            }
            else {
                _this.isExistInLocal = false;
            }
            _this.setBasicInfoStatus(_this.basicInfo);
        });
        this.newsInfo_subscription = localDataService.currentStockNews$.subscribe(function (newsInfo) {
            if (newsInfo) {
                if (newsInfo['status'] == 'error') {
                    _this.newsStatus = 2;
                }
                else {
                    _this.newsInfo = newsInfo['result'];
                    _this.newsStatus = 1;
                }
            }
            else {
                _this.newsStatus = 0;
            }
        });
        this.priceData_subscription = localDataService.priceData$.subscribe(function (priceData) {
            _this.priceData = priceData;
            _this.priceOption = _this.highChartDrawer.getPriceData(_this.priceData);
        });
        this.smaData_subscription = localDataService.smaData$.subscribe(function (smaData) {
            _this.smaData = smaData;
            _this.smaOption = _this.highChartDrawer.getIndicatorData(smaData, 'SMA');
        });
        this.emaData_subscription = localDataService.emaData$.subscribe(function (emaData) {
            _this.emaData = emaData;
            _this.emaOption = _this.highChartDrawer.getIndicatorData(emaData, 'EMA');
        });
        this.stochData_subscription = localDataService.stochData$.subscribe(function (stochData) {
            _this.stochData = stochData;
            _this.stochOption = _this.highChartDrawer.getIndicatorData(stochData, 'STOCH');
        });
        this.rsiData_subscription = localDataService.rsiData$.subscribe(function (rsiData) {
            _this.rsiData = rsiData;
            _this.rsiOption = _this.highChartDrawer.getIndicatorData(rsiData, 'RSI');
        });
        this.adxData_subscription = localDataService.adxData$.subscribe(function (adxData) {
            _this.adxData = adxData;
            _this.adxOption = _this.highChartDrawer.getIndicatorData(adxData, 'ADX');
        });
        this.cciData_subscription = localDataService.cciData$.subscribe(function (cciData) {
            _this.cciData = cciData;
            _this.cciOption = _this.highChartDrawer.getIndicatorData(cciData, 'CCI');
        });
        this.bbandsData_subscription = localDataService.bbandsData$.subscribe(function (bbandsData) {
            _this.bbandsData = bbandsData;
            _this.bbandsOption = _this.highChartDrawer.getIndicatorData(bbandsData, 'BBANDS');
        });
        this.macdData_subscription = localDataService.macdData$.subscribe(function (macdData) {
            _this.macdData = macdData;
            _this.macdOption = _this.highChartDrawer.getIndicatorData(macdData, 'MACD');
        });
    }
    StockDetailComponent.prototype.ngOnInit = function () {
        if (this.basicInfo && this.basicInfo["status"] == "success")
            this.isExistInLocal = this.localDataService.isExist(this.basicInfo['symbol']);
        else
            this.isExistInLocal = false;
        this.setBasicInfoStatus(this.basicInfo);
    };
    StockDetailComponent.prototype.setToStock = function () {
        this.currentContent = "stock";
    };
    StockDetailComponent.prototype.setToCharts = function () {
        this.currentContent = "chart";
    };
    StockDetailComponent.prototype.setToNews = function () {
        this.currentContent = "news";
    };
    StockDetailComponent.prototype.setIndicator = function (indicator) {
        this.currentIndicator = indicator;
    };
    StockDetailComponent.prototype.switchToFav = function () {
        this.stateService.stateToLeft();
    };
    StockDetailComponent.prototype.addToFav = function () {
        if (this.basicInfo && this.basicInfo["status"] == "success") {
            this.localDataService.addToLocal(this.basicInfo["favData"]);
        }
    };
    StockDetailComponent.prototype.favAction = function () {
        if (!this.isExistInLocal) {
            this.localDataService.addToLocal(this.basicInfo["favData"]);
            this.isExistInLocal = true;
        }
        else {
            this.localDataService.removeFromLocal(this.basicInfo["symbol"]);
            this.isExistInLocal = false;
        }
    };
    StockDetailComponent.prototype.ngOnDestroy = function () {
        // unsubscribe to ensure no memory leaks
        this.basicInfo_subscription.unsubscribe();
    };
    StockDetailComponent.prototype.getCurrentOption = function () {
        var thisOption = {};
        switch (this.currentIndicator) {
            case 'Price':
                thisOption = this.priceOption;
                break;
            case 'SMA':
                thisOption = this.smaOption;
                break;
            case 'EMA':
                thisOption = this.emaOption;
                break;
            case 'STOCH':
                thisOption = this.stochOption;
                break;
            case 'RSI':
                thisOption = this.rsiOption;
                break;
            case 'ADX':
                thisOption = this.adxOption;
                break;
            case 'CCI':
                thisOption = this.cciOption;
                break;
            case 'BBANDS':
                thisOption = this.bbandsOption;
                break;
            case 'MACD':
                thisOption = this.macdOption;
                break;
            default: break;
        }
        return thisOption;
    };
    StockDetailComponent.prototype.isShareDisable = function () {
        var option = this.getCurrentOption();
        if (option && option != "error")
            return false;
        return true;
    };
    StockDetailComponent.prototype.setBasicInfoStatus = function (basicInfo) {
        if (basicInfo) {
            if (basicInfo["status"] == "success")
                this.basicInfoStatus = 1;
            else
                this.basicInfoStatus = 2;
        }
        else
            this.basicInfoStatus = 0;
    };
    StockDetailComponent.prototype.share = function () {
        var _this = this;
        var data = {
            options: JSON.stringify(this.getCurrentOption()),
            type: 'image/png',
            async: true
        };
        var exportUrl = 'http://export.highcharts.com/';
        $.post(exportUrl, data, function (data) {
            var url = exportUrl + data;
            _this.postToFb(url);
        }).fail(function (response) {
        });
    };
    StockDetailComponent.prototype.postToFb = function (url) {
        FB.ui({
            app_id: '1967546740125899',
            method: 'feed',
            caption: 'An example caption',
            picture: url
        }, function (response) {
            if (response && !response.error_message) {
                alert("Posted Successfully");
            }
            else {
                alert("Not Posted");
            }
        });
    };
    return StockDetailComponent;
}());
StockDetailComponent = __decorate([
    core_1.Component({
        selector: 'stock-detail',
        template: __webpack_require__("../../../../../src/app/stock-detail.component.html"),
        styles: [__webpack_require__("../../../../../src/app/stock-detail.component.css")],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof local_data_service_1.localDataService !== "undefined" && local_data_service_1.localDataService) === "function" && _a || Object, typeof (_b = typeof state_service_1.stateService !== "undefined" && state_service_1.stateService) === "function" && _b || Object])
], StockDetailComponent);
exports.StockDetailComponent = StockDetailComponent;
var _a, _b;
//# sourceMappingURL=stock-detail.component.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_dynamic_1 = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
var app_module_1 = __webpack_require__("../../../../../src/app/app.module.ts");
var environment_1 = __webpack_require__("../../../../../src/environments/environment.ts");
__webpack_require__("../../../../hammerjs/hammer.js");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map