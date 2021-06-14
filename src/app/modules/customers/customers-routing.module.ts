import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowCustomersComponent } from './components/show-customers/show-customers.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { DetailsComponent } from './components/details/details.component';
import { UpdateCustomerComponent } from './components/update-customer/update-customer.component';
import { CreateCustomerComponent } from './components/Create-customer/Create-customer.component';


const routes: Routes = [
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
   { path: "UpdateCustomer/:id", component: UpdateCustomerComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowCustomersComponent, canActivate: [AppRouteGuard] },
  { path: "CreateCustomer", component: CreateCustomerComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }

