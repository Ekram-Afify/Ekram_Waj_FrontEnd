import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Injector,
} from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CategoryDto,
  CouponServiceProxy,
  CreateCategoryDto,
  UpdateCouponDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { SaveEditableRow } from "primeng/table/table";
import { message } from "@shared/Message/message";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-update-coupon",
  templateUrl: "./update-coupon.component.html",
  styleUrls: ["./update-coupon.component.scss"],
})
export class UpdateCouponComponent extends AppComponentBase implements OnInit {
  CouponForm: FormGroup;
  option = [
    {
      label: this.l("Percentage"),
      value: 1,
    },
    {
      label: this.l("Amount"),
      value: 2,
    },
  ];
  isSubmitted = false;
  _id;
  currentType = 1;
  coupon: any;
  selectedOption = {};
  // randomCode = Math.floor(Math.random() * 1000000 + 1);
  constructor(
    injector: Injector,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private couponServ: CouponServiceProxy,
    private _router: Router
  ) {
    super(injector);
    this.route.params.subscribe((params) => {
      this.CouponForm = this._formBuilder.group({
        couponType: [""],
        value: ["", [Validators.required]],
        code: ["", [Validators.required]],
        active: [""],
      });
      if (params["id"]) {
        this._id = params["id"];
        this.couponServ.get(this._id).subscribe((result) => {
          this.coupon = result;
          if (this.coupon.couponType == 2) {
            this.selectedOption = this.option[1];
          } else {
            this.selectedOption = this.option[0];
          }
          this.CouponForm = this._formBuilder.group({
            couponType: [this.selectedOption],
            value: [this.coupon.value, [Validators.required]],
            code: [this.coupon.code, [Validators.required]],
            active: [this.coupon.active],
          });
          // console.log("coupon : ", this.coupon.result);
        });
      }
    });
  }

  ngOnInit() {}
  onChange(event) {
    this.currentType = event.value.value;

    // console.log("event :", event.value.value);
  }
  clearInput(name) {
    this.CouponForm.get(name).setValue("");
  }
  cancel() {
    this._router.navigate(["/app/coupons"]);
  }
  submitCoupon() {
    this.isSubmitted = true;
    if (this.CouponForm.invalid) {
      return;
    } else {
      if (this.CouponForm.value["active"] == "") {
        this.CouponForm.value["active"] = false;
      }
      this.CouponForm.value["couponType"] = this.currentType;
      this.CouponForm.value["CreationTime"] = new Date();
      if (this._id) {
        this.CouponForm.value["id"] = this.coupon.id;
        console.log("edit CouponForm : ", this.CouponForm.value);
        this.couponServ.update(this.CouponForm.value).subscribe((res) => {
          message.Toast.fire(this.l("SavedSuccessfully"));
          this._router.navigate(["/app/coupons"]);
        });
      } else {
        console.log("add CouponForm : ", this.CouponForm.value);
        this.couponServ.create(this.CouponForm.value).subscribe((res) => {
          message.Toast.fire(this.l("SavedSuccessfully"));
          this._router.navigate(["/app/coupons"]);
        });
      }
    }
  }
}
