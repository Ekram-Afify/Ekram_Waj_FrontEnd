import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientAddressesRoutingModule } from './client-addresses-routing.module';
import { ShowClientAddressesComponent } from './components/show-client-addresses/show-client-addresses.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { DetailsComponent } from './components/details/details.component';
import { UpdateCustomerAddressComponent } from './components/update-customer-address/update-customer-address.component';
import { AgmCoreModule } from '@agm/core';



// import {
//   MDBBootstrapModule,
//   WavesModule,
//   TableModule
// } from "angular-bootstrap-md";

@NgModule({
  declarations: [ShowClientAddressesComponent, DetailsComponent, UpdateCustomerAddressComponent],
  imports: [
    CommonModule,
    ClientAddressesRoutingModule,
    HttpClientModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCYTz4U5IYlJBEQlDdKrOJx5mGqE0vPt-E',
      libraries: ['places', 'geometry', 'drawing']
    }),

    // MDBBootstrapModule.forRoot(),
    // WavesModule,
    // TableModule,
  ]
})
export class ClientAddressesModule { }
