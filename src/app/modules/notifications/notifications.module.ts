import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NotificationsRoutingModule } from "./notifications-routing.module";
import { SharedModule } from "../../../shared/shared.module";
import { CreateNotificationComponent } from "./create-notification/create-notification.component";
import { HttpClientModule } from "@angular/common/http";
import { MultiSelectModule } from "primeng/multiselect";
@NgModule({
  declarations: [CreateNotificationComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    HttpClientModule,
    MultiSelectModule,
  ],
})
export class NotificationsModule {}
