import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { ReservationsRoutingModule } from './reservations-routing.module';
import { ShowReservationsComponent } from './components/show-reservations/show-reservations.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { CreateReservationComponent } from './components/create-reservation/create-reservation.component';
import { UpdateReservationComponent } from './components/update-reservation/update-reservation.component';
import { DetailsComponent } from './components/details/details.component';
import { BillComponent } from './components/bill/bill.component';
import { AgmDirectionModule } from 'agm-direction';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
  declarations: [ShowReservationsComponent, CreateReservationComponent, UpdateReservationComponent, DetailsComponent,BillComponent],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    HttpClientModule,
    SharedModule,
    NgxPrintModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvQj5-9vkArSGzhY9EE1NY3wTHWvKn6pU',
      libraries: ['places', 'geometry', 'drawing']
    }),
    AgmDirectionModule
  ]
})
export class ReservationsModule { }