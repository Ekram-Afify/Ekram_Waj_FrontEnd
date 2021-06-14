import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShowDriversComponent } from "./components/show-drivers/show-drivers.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { UpdateDriverComponent } from "./components/update-driver/update-driver.component";
import { DetailsComponent } from "./components/details/details.component";
import { CreateDriverComponent } from "./components/create-driver/create-driver.component";
import { RegisterDriverComponent } from "./components/register-driver/register-driver.component";

const routes: Routes = [
  // { path: "", component: CreateEmployeeeComponent, canActivate: [AppRouteGuard] },
  // { path: "createExternalEmployee", component: CreateExternalEmployeeComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowDriversComponent, canActivate: [AppRouteGuard] },
  // { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  {
    path: "UpdateDriver/:id",
    component: UpdateDriverComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "details/:idd",
    component: UpdateDriverComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "CreateDriver",
    component: CreateDriverComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "RegisterDriver/:id",
    component: RegisterDriverComponent,
    canActivate: [AppRouteGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversRoutingModule {}
