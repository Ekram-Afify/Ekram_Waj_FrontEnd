import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatSupportComponent } from './components/chat-support/chat-support.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';


const routes: Routes = [
  { path: "", component: ChatSupportComponent, canActivate: [AppRouteGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
