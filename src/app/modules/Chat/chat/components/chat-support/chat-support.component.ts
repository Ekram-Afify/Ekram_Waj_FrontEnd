import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserServiceProxy, UserDto, AdminMessageDto, AdminCreateMessageDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { NgAnimateScrollService } from 'ng-animate-scroll';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.scss']
})
export class ChatSupportComponent implements OnInit {
  @ViewChild(ScrollToBottomDirective, {static: false})  scroll: ScrollToBottomDirective;
  items: any;
  members: UserDto[];
  member: UserDto;
  mess: any;
  search: any;
  _id: any;

  memberMessages: AdminMessageDto[];

  constructor(private _userService: UserServiceProxy, private animateScrollService: NgAnimateScrollService) { }

  ngOnInit() {
    this.initMembers();
    this.search = '';
    this.memberMessages = [];

    abp.event.on('abp.notifications.received', (userNotification) => {
      if (userNotification.notification.data.type === 'Abp.Notifications.MessageNotificationData') {
        const newmessage = new AdminMessageDto();
        newmessage.id = this.memberMessages.length + 1;
        newmessage.content = userNotification.notification.data.properties.Message;
        newmessage.isFromAdmin = false;
        newmessage.messageTime = moment.utc();

        this.memberMessages.push(newmessage);
        // $.each(userNotification.notification.data.properties.Message, function (key, value) {
        //   console.log(value);
        // });
      }
    });
  }


  getUserMessages(id) {
    this._id = id;
    this._userService
      .adminGetSpUserMessages(id)
      .subscribe((res: AdminMessageDto[]) => {
        this.memberMessages = res;
        this.member = this.members.find(c => c.id === this._id);
        $('.messages').animate({ scrollTop: 100000000 }, 'fast');
      });
  }

  initMembers() {
    this._userService
      .adminGetMessageUsers()
      .subscribe((res: UserDto[]) => {
        this.members = res;
        this.items = this.members.length;
      });
  }

  send() {
    if (this.mess !== undefined && this.mess !== null && this.mess.trim() !== '' && this.mess !== '') {
      const model: AdminCreateMessageDto = new AdminCreateMessageDto();
      const modelDto: AdminMessageDto = new AdminMessageDto();
      modelDto.content = this.mess;
      modelDto.isFromAdmin = true;
      modelDto.messageTime = moment(new Date());

      model.content = this.mess;
      model.to = this._id;
      this._userService
        .adminSendMessage(model)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(() => {
          this.memberMessages.push(modelDto);
          this.mess = undefined;
          $('.messages').animate({ scrollTop: 100000000 }, 'fast');
        });
    }

  }
}
