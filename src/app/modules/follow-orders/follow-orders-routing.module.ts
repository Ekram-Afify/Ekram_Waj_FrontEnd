import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FollowOrderComponent } from "./follow-order/follow-order.component";

const routes: Routes = [
  {
    path: "followorders/:id",
    component: FollowOrderComponent,
  },
  {
    path: "followorders",
    component: FollowOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowOrdersRoutingModule {}
