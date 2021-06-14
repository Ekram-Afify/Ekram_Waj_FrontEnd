import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReservationComponent } from "./components/reservation/reservation.component";
import { TopclientsComponent } from "./components/topclients/topclients.component";
import { TopdriversComponent } from "./components/topdrivers/topdrivers.component";
import { ReportsComponent } from "./components/reports/reports.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { PaymentsComponent } from "./payments/payments.component";
import { PaymentDetailsComponent } from "./payment-details/payment-details.component";
import { EvaluationsComponent } from "./evaluations/evalutions.component";
import { NewCustomersComponent } from "./components/newcustomers/newcustomers.component";
import { NewDriversComponent } from "./components/newDrivers/newDrivers.component";
import { NewordersComponent } from "./components/neworders/neworders.component";
const routes: Routes = [
  {
    path: "reservation",
    component: ReservationComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "topclients",
    component: TopclientsComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "payments",
    component: PaymentsComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "payments/payment/:id",
    component: PaymentDetailsComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "topdrivers",
    component: TopdriversComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "reports",
    component: ReportsComponent,
    canActivate: [AppRouteGuard],
  },
  {
    path: "evaluations/:isClient",
    component: EvaluationsComponent,
    canActivate: [AppRouteGuard],
  },{
    path: "newcustomers",
    component: NewCustomersComponent,
    canActivate: [AppRouteGuard],
  },{
    path: "newdrivers",
    component: NewDriversComponent,
    canActivate: [AppRouteGuard],
  },{
    path: "neworders",
    component: NewordersComponent,
    canActivate: [AppRouteGuard],
  },
  { path: "", component: ReportsComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
