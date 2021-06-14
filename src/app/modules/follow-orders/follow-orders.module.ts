import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FollowOrdersRoutingModule } from "./follow-orders-routing.module";
import { FollowOrderComponent } from "./follow-order/follow-order.component";
import { SharedModule } from "../../../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import { AgmDirectionModule } from "agm-direction";

@NgModule({
  declarations: [FollowOrderComponent],
  imports: [
    CommonModule,
    FollowOrdersRoutingModule,
    SharedModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDvQj5-9vkArSGzhY9EE1NY3wTHWvKn6pU",
      libraries: ["places", "geometry", "drawing"],
    }),
    AgmDirectionModule,
  ],
})
export class FollowOrdersModule {}
