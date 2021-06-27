import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { ShowComplaintsComponent } from './components/show-complaints/show-complaintscomponent';
import { ComplaintDetailsComponent } from './components/complaint-details/complaint-details.component';



@NgModule({
  declarations: [ShowComplaintsComponent,ComplaintDetailsComponent ],
  imports: [
    CommonModule,
    ComplaintsRoutingModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class ComplaintsModule { }
