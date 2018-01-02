import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { localDataService } from './local-data.service';
import { Subscription }   from 'rxjs/Subscription';
import { stateService } from './state.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.css'],
  animations: [
    trigger('favState', [
      state('left', style({
        'display': 'block',
      })),
      state('right', style({
        'display': 'none'
      })),
      transition('right => left', [
        style({transform: 'translateX(100%)'}),
        animate(1000)
      ])
    ]),
    trigger('infoState', [
      state('left', style({
        'display': 'none',
      })),
      state('right', style({
        'display': 'block'
      })),
      transition('left => right', [
        style({transform: 'translateX(-100%)'}),
        animate(1000)
      ])
    ])
  ]
})
export class ResultFormComponent implements OnDestroy {

  testLocal: string;
  currentSymbol:string;
  subscription: Subscription;

  favState_subscription: Subscription;
  favState = "left";

  infoState_subscription: Subscription;
  infoState = "left";

  constructor(
    private localDataService: localDataService,
    private stateService: stateService
  ) {
    this.testLocal = localStorage.getItem('localTest');
    this.subscription = localDataService.subjectAnnounce$.subscribe(
      currentSymbol => {
        this.currentSymbol = currentSymbol;
      });
    this.favState_subscription = stateService.favoriteState$.subscribe(
      favState => {
        this.favState = favState;
      });
    this.infoState_subscription = stateService.stockDetailState$.subscribe(
      infoState => {
        this.infoState = infoState;
      }
    )
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}

