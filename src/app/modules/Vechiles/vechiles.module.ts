import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { VechilesRoutingModule } from './vechiles-routing.module';
import { CreateVechileComponent } from './components/create-vechile/create-vechile.component';
import { DetailsComponent } from './components/details/details.component';
import { ShowVechilesComponent } from './components/show-vechiles/show-vechiles.component';


@NgModule({
  declarations: [CreateVechileComponent,DetailsComponent,ShowVechilesComponent],
  imports: [
    CommonModule,
    VechilesRoutingModule,
    HttpClientModule,
    SharedModule
  ]
})
export class VechilesModule { }
