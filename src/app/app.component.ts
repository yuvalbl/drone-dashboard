import {Component} from '@angular/core';
import {DataService} from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numOfDrones = 60;
  title = 'drone-dashboard';

  constructor(private dataService: DataService) {

  }

  recalculateData() {
    this.dataService.generateGameData(this.numOfDrones );
  }
}
