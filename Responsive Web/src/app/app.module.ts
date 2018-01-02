import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatOptionModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent }         from './app.component';
import { AutoCompleteSearchComponent} from './autocomplete-search.component'
import { ResultFormComponent } from './result-form.component'
import { FavoriteListComponent } from './favorite-list.component';
import { StockDetailComponent } from './stock-detail.component';
import { HistoricalChartComponent } from './historical-chart.component';
import { IndicatorChartComponent } from './indicator-chart.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    AutoCompleteSearchComponent,
    ResultFormComponent,
    FavoriteListComponent,
    StockDetailComponent,
    HistoricalChartComponent,
    IndicatorChartComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
