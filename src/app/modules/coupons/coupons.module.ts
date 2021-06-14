import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CouponsRoutingModule } from "./coupons-routing.module";
import { SharedModule } from "../../../shared/shared.module";
import { ShowCouponsComponent } from "./components/show-coupons/show-coupons.component";
import { UpdateCouponComponent } from "./components/update-coupon/update-coupon.component";
import { HttpClientModule } from "@angular/common/http";
// import { CouponServiceProxy } from "../../../shared/service-proxies/service-proxies";

@NgModule({
  declarations: [ShowCouponsComponent, UpdateCouponComponent],
  imports: [CommonModule, CouponsRoutingModule, SharedModule, HttpClientModule],
})
export class CouponsModule {}
