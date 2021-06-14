import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PanelUsersComponent } from "./panel-users/panel-users.component";
import { AppRouteGuard } from "../../../shared/auth/auth-route-guard";
import { PanelUserPageComponent } from "./panel-user-page/panel-user-page.component";

const routes: Routes = [
  {
    path: "",
    component: PanelUsersComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "newUser",
    component: PanelUserPageComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "user/:id",
    component: PanelUserPageComponent,
    canActivate: [AppRouteGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PanelUsersRoutingModule {}
