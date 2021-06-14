import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyClientsRoutingModule } from './company-clients-routing.module';
import { CreateCompanyClientComponent } from './components/create-company-client/create-company-client.component';
import { ShowCompanyClientsComponent } from './components/show-company-clients/show-company-clients.component';
import { DetailsComponent } from './components/details/details.component';
import { UpdateCompanyClientComponent } from './components/update-company-client/update-company-client.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [CreateCompanyClientComponent, ShowCompanyClientsComponent, DetailsComponent, UpdateCompanyClientComponent],
  imports: [
    CommonModule,
    CompanyClientsRoutingModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class CompanyClientsModule { }
