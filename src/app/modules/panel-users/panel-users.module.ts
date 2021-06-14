import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PanelUsersRoutingModule } from "./panel-users-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../../../shared/shared.module";
import { PanelUsersComponent } from "./panel-users/panel-users.component";
import { PanelUserPageComponent } from "./panel-user-page/panel-user-page.component";

@NgModule({
  declarations: [PanelUsersComponent, PanelUserPageComponent],
  imports: [
    CommonModule,
    PanelUsersRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
})
export class PanelUsersModule {}
