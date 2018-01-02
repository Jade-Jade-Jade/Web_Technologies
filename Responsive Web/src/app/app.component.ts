import { Component } from '@angular/core';
import { localDataService } from './local-data.service';
import { stateService } from './state.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [localDataService, stateService]
})
export class AppComponent {
  title = 'Stock';
}
