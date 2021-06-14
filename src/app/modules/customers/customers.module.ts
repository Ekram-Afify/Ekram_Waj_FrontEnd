import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { ShowCustomersComponent } from './components/show-customers/show-customers.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { UpdateCustomerComponent } from './components/update-customer/update-customer.component';
import { DetailsComponent } from './components/details/details.component';
import { CreateCustomerComponent } from './components/Create-customer/Create-customer.component';


@NgModule({
  declarations: [ShowCustomersComponent, UpdateCustomerComponent, DetailsComponent,CreateCustomerComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class CustomersModule { }
