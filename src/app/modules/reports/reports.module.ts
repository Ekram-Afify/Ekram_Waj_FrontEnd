import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReservationComponent } from './components/reservation/reservation.component';
import { TopclientsComponent } from './components/topclients/topclients.component';
import { TopdriversComponent } from './components/topdrivers/topdrivers.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { EvaluationsComponent } from './evaluations/evalutions.component';
import { RatingModule } from 'primeng/rating';
import { NewCustomersComponent } from './components/newcustomers/newcustomers.component';
import { NewDriversComponent } from './components/newDrivers/newDrivers.component';
import { NewordersComponent } from './components/neworders/neworders.component';


@NgModule({
  declarations: [ReservationComponent,TopclientsComponent, TopdriversComponent, ReportsComponent, PaymentsComponent, PaymentDetailsComponent,EvaluationsComponent,NewCustomersComponent,NewDriversComponent, NewordersComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    HttpClientModule,
    RatingModule,
    SharedModule
  ],schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ReportsModule { }
