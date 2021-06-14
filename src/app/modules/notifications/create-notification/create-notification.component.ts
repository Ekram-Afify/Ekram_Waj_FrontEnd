import { Component, OnInit, NgZone, Injector } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  AdminClientServiceProxy,
  NotificationServiceProxy,
} from "../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "shared/app-component-base";
import { message } from "@shared/Message/message";
@Component({
  selector: "app-create-notification",
  templateUrl: "./create-notification.component.html",
  styleUrls: ["./create-notification.component.scss"],
})
export class CreateNotificationComponent
  extends AppComponentBase
  implements OnInit {
  NotificationForm: FormGroup;
  isSubmitted = false;
  customers = [];
  label = "";
  constructor(
    private _formBuilder: FormBuilder,
    // private driversServices: AdminDriverServiceProxy,
    injector: Injector,
    private ngZone: NgZone,
    private _customerService: AdminClientServiceProxy,
    private notificationService: NotificationServiceProxy
  ) {
    super(injector);

    this.NotificationForm = this._formBuilder.group({
      title: ["", [Validators.required]],
      clientIds: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.label = this.l("Customers");
    this._customerService.getAllClients(undefined).subscribe((res) => {
      const ReqResult = res;
      var customrs = [];
      // customrs.push({ label: this.l("Customers"), value: null });
      ReqResult.forEach((element) => {
        customrs.push({
          label: element.firstName + " " + element.lastName,
          value: element.userId,
        });
      });
      this.customers = customrs;
      // console.log("customers : ", this.customers);
    });
  }
  submitNotification() {
    this.isSubmitted = true;
    if (this.NotificationForm.invalid) {
      return;
    } else {
      for (let i = 0; i < this.NotificationForm.value.clientIds.length; i++) {
        this.NotificationForm.value.clientIds[
          i
        ] = this.NotificationForm.value.clientIds[i].value;
      }
      this.notificationService
        .sendClientNotification(this.NotificationForm.value)
        .subscribe((res) => {
          message.Toast.fire(this.l("SavedSuccessfully"));
          this.NotificationForm.reset();
        });
      console.log("notfication data : ", this.NotificationForm.value);
    }
  }
}
