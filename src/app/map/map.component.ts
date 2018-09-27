import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {tap} from 'rxjs/internal/operators';
import {AcNotification, MapLayerProviderOptions, MapsManagerService} from 'angular-cesium';
const Cesium = window['Cesium'];

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  activeProvider = MapLayerProviderOptions.ArcGisMapServer;
  IMAGES_PATH = './assets/images/';
  areaLimits;
  drones$;
  pads$;

  constructor(private dataService: DataService,
              private mapsManagerService: MapsManagerService) {

    this.areaLimits = this.dataService.getArea();
  }

  ngOnInit() {
    this.initNotifications();
    window.setTimeout(this.goToArea.bind(this), 0);
  }

  initNotifications() {
    this.drones$ = this.dataService.getDronesNotifications().pipe(
      tap((notification: AcNotification) => {
        const entity: any = notification.entity;
        entity.position = Cesium.Cartesian3.fromDegrees(entity.location.long, entity.location.lat);
        entity.image = `${this.IMAGES_PATH}drone${entity.isLanded ? '_landed' : ''}.png`;
        entity.labelText = `${entity.id.substr(0, 6)} (${entity.isLanded ? `Charging - ${entity.battery.toFixed(2)}%` : 'Moving'})`;
        entity.labelColor = Cesium.Color.BLACK;
      })
    );

    this.pads$ = this.dataService.getPadsNotifications().pipe(
      tap((notification: AcNotification) => {
        const entity: any = notification.entity;
        entity.position = Cesium.Cartesian3.fromDegrees(entity.location.long, entity.location.lat, -1);
        // entity.image = '/src/assets/images/pad.png';
        entity.image = `${this.IMAGES_PATH}pad${entity.availableSpot ? '' : '_na'}.png`;
        entity.labelText = `${entity.id.substr(0, 6)} (${entity.availableSpot ? 'Available' : 'N/A'})`;
        entity.labelColor = Cesium.Color.BLACK;
      })
    );
  }

  goToArea() {
    const north = this.areaLimits.latHigh;
    const south = this.areaLimits.latLow;
    const east = this.areaLimits.longHigh;
    const west = this.areaLimits.longLow;

    this.mapsManagerService.getMap().getCameraService().cameraFlyTo({
      destination: Cesium.Rectangle.fromDegrees(west, south, east, north)
    });
  }

}
