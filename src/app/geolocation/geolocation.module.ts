import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeolocationRoutingModule } from './geolocation-routing.module';
import { LocationdemoComponent } from './Components/locationdemo/locationdemo.component';


@NgModule({
  declarations: [LocationdemoComponent],
  imports: [
    CommonModule,
    GeolocationRoutingModule
  ]
})
export class GeolocationModule { }
