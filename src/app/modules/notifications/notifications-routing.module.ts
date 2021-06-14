import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateNotificationComponent } from "./create-notification/create-notification.component";

const routes: Routes = [
  {
    path: "",
    component: CreateNotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
