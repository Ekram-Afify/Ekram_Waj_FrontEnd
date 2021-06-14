import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { WaselDriversRoutingModule } from './wasel-drivers-routing.module';
import { CreateWaselDriverComponent } from './components/create-wasel-Driver/create-wasel-Driver.component';
import { DetailsComponent } from './components/details/details.component';
import { ShowWaselDriversComponent } from './components/show-wasel-drivers/show-wasel-drivers.component';


@NgModule({
  declarations: [CreateWaselDriverComponent,DetailsComponent,ShowWaselDriversComponent],
  imports: [
    CommonModule,
    WaselDriversRoutingModule,
    HttpClientModule,
    SharedModule
  ]
})
export class WaselDriversModule { }
