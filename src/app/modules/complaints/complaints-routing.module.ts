import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ComplaintDetailsComponent } from './components/complaint-details/complaint-details.component';
import { ShowComplaintsComponent } from './components/show-complaints/show-complaintscomponent';




const routes: Routes = [

  { path: "", component: ShowComplaintsComponent, canActivate: [AppRouteGuard] },
  { path: "complaint-details/:id", component: ComplaintDetailsComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsRoutingModule { }
