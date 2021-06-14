import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateVechileComponent } from './components/create-vechile/create-vechile.component';
import { DetailsComponent } from './components/details/details.component';
import { ShowVechilesComponent } from './components/show-vechiles/show-vechiles.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';


const routes: Routes = [
  { path: "create", component: CreateVechileComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowVechilesComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VechilesRoutingModule { }
