import { Injectable, OnInit } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { HttpClient } from '@angular/common/http';
import { HttpParams } from "@angular/common/http";

@Injectable()
export class autocompleteSearchService {

  //private domain = 'http://angular-express-env.quiexmfkcc.us-west-2.elasticbeanstalk.com';
  private domain = '';
  private symbolApi = this.domain + '/guessSymbolApi';  // URL to web api - remember to remove when complete

  constructor(private http: HttpClient){};

  private symbolList = new Subject<any>();
  symbolList$ = this.symbolList.asObservable();

  fetchSymbolList(currenTypeIn: string) {
    const params = new HttpParams()
      .set('input', currenTypeIn);
    this.http.get(this.symbolApi, {params}).subscribe(
      data => {
        this.symbolList.next(data);
      }
    );
  }

}
