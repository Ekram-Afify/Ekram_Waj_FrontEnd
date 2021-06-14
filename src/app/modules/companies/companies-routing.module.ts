import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowCompaniesComponent } from './components/show-companies/show-companies.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CreateCompanyComponent } from './components/create-company/create-company.component';
import { DetailsComponent } from './components/details/details.component';
import { UpdateCompanyComponent } from './components/update-company/update-company.component';



const routes: Routes = [
  { path: "create", component: CreateCompanyComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowCompaniesComponent, canActivate: [AppRouteGuard] },
   { path: "UpdateCompany/:id", component: UpdateCompanyComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
