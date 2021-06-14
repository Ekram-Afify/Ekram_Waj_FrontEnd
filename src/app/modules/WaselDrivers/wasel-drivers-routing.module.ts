import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWaselDriverComponent } from './components/create-wasel-Driver/create-wasel-Driver.component';
import { DetailsComponent } from './components/details/details.component';
import { ShowWaselDriversComponent } from './components/show-wasel-drivers/show-wasel-drivers.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';


const routes: Routes = [
  { path: "create", component: CreateWaselDriverComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowWaselDriversComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaselDriversRoutingModule { }
