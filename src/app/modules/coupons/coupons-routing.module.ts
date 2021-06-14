import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateCouponComponent } from "./components/create-coupon/create-coupon.component";
import { ShowCouponsComponent } from "./components/show-coupons/show-coupons.component";
import { DetailsComponent } from "./components/details/details.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "@shared/shared.module";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { UpdateCouponComponent } from "./components/update-coupon/update-coupon.component";

const routes: Routes = [
  // { path: "newCoupon", component: CreateCouponComponent, canActivate: [AppRouteGuard] },
  // { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
  // { path: "", component: ShowCouponsComponent, canActivate: [AppRouteGuard] },
  //  { path: "UpdateCoupon/:id", component: UpdateCouponComponent, canActivate: [AppRouteGuard] },
  {
    path: "",
    component: ShowCouponsComponent, canActivate: [AppRouteGuard]
  },
  {
    path: "newCoupon",
    component: UpdateCouponComponent,canActivate: [AppRouteGuard]
  },
  {
    path: "coupon/:id",
    component: UpdateCouponComponent,canActivate: [AppRouteGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponsRoutingModule {}
