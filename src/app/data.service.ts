import {Injectable} from '@angular/core';
import {interval, Observable, Subscriber} from 'rxjs';
import {initData, playRound, roundInterval, area as areaLimits} from './mock/data.mock';
import {map, share} from 'rxjs/internal/operators';
import {AcNotification} from 'angular-cesium';
import {AcEntity} from 'angular-cesium/src/angular-cesium/models/ac-entity';
import {ActionType} from 'angular-cesium/src/angular-cesium/models/action-type.enum';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  data$;
  dronesNotification$;
  padsNotification$;

  // interval(roundInterval).pipe(

  constructor() {
    this.generateGameData();
    // convert item to notification to be used by cesium
    const toNotification = (item, id) => {
      const notification = new AcNotification();
      notification.id = id;
      notification.entity = new AcEntity(item);
      notification.actionType = ActionType.ADD_UPDATE;
      return notification;
    };

    this.data$ = interval(roundInterval).pipe(
      map(() => playRound()),
      share()
    );

    this.dronesNotification$ = Observable.create((observer: Subscriber<any>) => {
      this.data$.subscribe(data => {
        data.drones.forEach((drone, index) => {
          observer.next(toNotification(drone, index));
        });
      });
    });

    this.padsNotification$ = Observable.create((observer: Subscriber<any>) => {
      this.data$.subscribe(data => {
        data.pads.forEach((pad, index) => {
          observer.next(toNotification(pad, index));
        });
      });
    });
  }

  generateGameData(drones = 60) {
    const pads = Math.floor(drones * .6);
    initData(drones, pads, 20);
  }

  getDronesNotifications(): Observable<any> {
    return this.dronesNotification$;
  }

  getPadsNotifications(): Observable<any> {
    return this.padsNotification$;
  }

  getArea() {
    return areaLimits;
  }
}
