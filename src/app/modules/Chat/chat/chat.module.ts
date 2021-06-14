import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatSupportComponent } from './components/chat-support/chat-support.component';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollToBottomDirective } from './components/chat-support/scroll-to-bottom.directive';


@NgModule({
  declarations: [ChatSupportComponent, ScrollToBottomDirective],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatCardModule,
    MatBadgeModule,
    MatIconModule,
    ScrollingModule,
    SharedModule
  ]
})
export class ChatModule { }
