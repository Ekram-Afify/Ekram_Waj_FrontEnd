import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';


import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { AgmDirectionModule } from 'agm-direction';
import {NgxPrintModule} from 'ngx-print';
import { ShowClientCompanyReservationsComponent } from './components/show-client-company-reservations/show-client-company-reservations.component';
import { ClientCompanyReservationsRoutingModule } from './client-company-reservations-routing.module';
import { ReservationOfferPriceComponent } from './components/reservation-offer-price/reservation-offer-price.component';


@NgModule({
  declarations: [ShowClientCompanyReservationsComponent,ReservationOfferPriceComponent],
  imports: [
    CommonModule,
    ClientCompanyReservationsRoutingModule,
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
export class ClientCompanyReservationsModule { }