import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowClientAddressesComponent } from './components/show-client-addresses/show-client-addresses.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { DetailsComponent } from './components/details/details.component';
import { UpdateCustomerAddressComponent } from './components/update-customer-address/update-customer-address.component';


const routes: Routes = [
  
  { path: ":id", component: ShowClientAddressesComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
   { path: "UpdateClientAddress/:id", component: UpdateCustomerAddressComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientAddressesRoutingModule { }
