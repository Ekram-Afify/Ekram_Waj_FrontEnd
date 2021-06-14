import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCompanyClientComponent } from './components/create-company-client/create-company-client.component';
import { DetailsComponent } from './components/details/details.component';
import { ShowCompanyClientsComponent } from './components/show-company-clients/show-company-clients.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { UpdateCompanyClientComponent } from './components/update-company-client/update-company-client.component';

const routes: Routes = [
{ path: "create", component: CreateCompanyClientComponent, canActivate: [AppRouteGuard] },
{ path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
{ path: "", component: ShowCompanyClientsComponent, canActivate: [AppRouteGuard] },
 { path: "UpdateCompanyClient/:id", component: UpdateCompanyClientComponent, canActivate: [AppRouteGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyClientsRoutingModule { }
