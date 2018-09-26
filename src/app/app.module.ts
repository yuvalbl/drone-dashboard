import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AngularCesiumModule, CameraService, CesiumService} from 'angular-cesium';
import { MapComponent } from './map/map.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [CameraService, CesiumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
