import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { ShowCompaniesComponent } from './components/show-companies/show-companies.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { CreateCompanyComponent } from './components/create-company/create-company.component';
import { UpdateCompanyComponent } from './components/update-company/update-company.component';
import { DetailsComponent } from './components/details/details.component';


@NgModule({
  declarations: [ShowCompaniesComponent, CreateCompanyComponent, UpdateCompanyComponent, DetailsComponent],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class CompaniesModule { }
