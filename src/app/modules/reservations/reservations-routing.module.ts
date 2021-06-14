import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowReservationsComponent } from './components/show-reservations/show-reservations.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CreateReservationComponent } from './components/create-reservation/create-reservation.component';
import { DetailsComponent } from './components/details/details.component';
import { UpdateReservationComponent } from './components/update-reservation/update-reservation.component';
import { BillComponent } from './components/bill/bill.component';


const routes: Routes = [
  { path: "create", component: CreateReservationComponent, canActivate: [AppRouteGuard] },
  { path: "details/:id", component: DetailsComponent, canActivate: [AppRouteGuard] },
   { path: "UpdateReservation/:id", component: UpdateReservationComponent, canActivate: [AppRouteGuard] },
  { path: "", component: ShowReservationsComponent, canActivate: [AppRouteGuard] },
  { path: "bill/:id", component: BillComponent, canActivate: [AppRouteGuard] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule { }
