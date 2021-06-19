import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ReservationOfferPriceComponent } from './components/reservation-offer-price/reservation-offer-price.component';
import { ShowClientCompanyReservationsComponent } from './components/show-client-company-reservations/show-client-company-reservations.component';



const routes: Routes = [
  { path: "", component: ShowClientCompanyReservationsComponent, canActivate: [AppRouteGuard] },
  { path: "reservation-offer-price/:id", component: ReservationOfferPriceComponent, canActivate: [AppRouteGuard] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientCompanyReservationsRoutingModule { }
