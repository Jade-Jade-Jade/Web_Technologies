import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class stateService {


  private favoriteState = new Subject<string>();
  favoriteState$ = this.favoriteState.asObservable();

  private stockDetailState = new Subject<string>();
  stockDetailState$ = this.stockDetailState.asObservable();

  stateToLeft() {
    this.favoriteState.next("left");
    this.stockDetailState.next("left");
  }

  stateToRight() {
    this.favoriteState.next("right");
    this.stockDetailState.next("right");
  }

}
