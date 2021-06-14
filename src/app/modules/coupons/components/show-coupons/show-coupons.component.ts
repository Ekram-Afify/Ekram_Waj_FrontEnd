import {
  RoleServiceProxy,
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  CouponServiceProxy,
  CouponDto,
} from "../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { lowerFirst } from "lodash";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-show-coupons",
  templateUrl: "./show-coupons.component.html",
  styleUrls: ["./show-coupons.component.scss"],
})
export class ShowCouponsComponent extends AppComponentBase implements OnInit {
  tabNum = 1;
  items: MenuItem[];
  selectedCars3: any[];
  personnelsCols: any[];
  cars: any[];
  cars2: any[];

  departments: SelectItem[] = [];
  branches: SelectItem[] = [];
  personalStatuses: SelectItem[] = [];

  name: any;
  department: SelectItem;
  branch: SelectItem;
  personalStatus: SelectItem;

  Coupons = [];

  companiesTotalCount: number;
  externalCompaniesTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;

  sorting: string;
  reset: any;
  availabelEdit = false;
  constructor(
    injector: Injector,

    private translationService: TranslationService,
    private translate: TranslateService,
    private Coupons_Service: CouponServiceProxy
  ) {
    super(injector);
    if (JSON.parse(localStorage.getItem("authenticateResult"))) {
      this.availabelEdit = JSON.parse(
        localStorage.getItem("authenticateResult")
      ).availableEditDelete;
    }
  }

  ngOnInit() {
    this.initItems();

    this.loadCoupons();
  }

  loadCoupons() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    var couponType = filetrObj["CouponType"];
    var discount = filetrObj["Value"];
    var active = filetrObj["Active"];
    this.Coupons_Service.getAll(
      // this.name,
      JSON.stringify(filetrObj),
      couponType == null || couponType === undefined || couponType == "0"
        ? undefined
        : parseInt(filetrObj["CouponType"]),
      discount == null || discount === undefined || discount == "0"
        ? undefined
        : parseInt(filetrObj["Value"]),
      active == null || active === undefined || active == "0"
        ? undefined
        : filetrObj["Active"],
      this.sorting == "" ? undefined : this.sorting,
      this.skipCount,
      this.maxResultCount
    ).subscribe((res) => {
      debugger;
      console.log("res : ", res);

      this.Coupons = res.items;
      this.totalCount = res.totalCount;
      this.spinner.hide();
    });
  }
  changePaginationTable(event) {
    this.rowTable = event.value;
    this.maxResultCount = event.value;
    this.skipCount = 0;
    this.rowsFirstCount = 1;
    if (this.totalCount <= event.value) {
      this.rowsEndCount = this.totalCount;
    } else {
      this.rowsEndCount = event.value;
    }
    this.loadCoupons();
  }

  paginate(event) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;

    var rest = this.totalCount - this.skipCount;
    if (rest <= event.rows) {
      this.rowsEndCount = this.totalCount;
    } else {
      this.rowsEndCount = event.first + event.rows;
    }
    this.rowsFirstCount = event.first + 1;

    this.loadCoupons();
  }
  initItems() {
    this.items = [{ label: this.l("Coupons") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "Code", header: this.l("Code") },
      { field: "CouponType", header: this.l("CouponType") },
      { field: "Value", header: this.l("Discount") },
      { field: "Active", header: this.l("Status") },
      { field: "CreationTime", header: this.l("CreationTime") },
    ];
  }

  resetFilters() {
    this.reset = $(".i-filter");
    this.reset.val("");
    this.branch = null;
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.name = "";

    this.loadCoupons();
  }

  removeCoupon(coupon) {
    this.message.confirm(
      this.l("DeleteConfirmation"),
      this.l("SystemNotification"),
      (result) => {
        if (result) {
          this.Coupons_Service.delete(coupon)
            .pipe(finalize(() => {}))
            .subscribe((res: any) => {
              if (!res) {
                // this.message.success(this.l('RemovedCoupon'), this.l('SystemNotification'));
                this.loadCoupons();
              } else {
                this.message.error(
                  this.l("CannotRemoveCoupon"),
                  this.l("SystemNotification")
                );
              }
            });
        }
      }
    );
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadCoupons();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order == 1 ? " Asc" : " Desc");

    this.loadCoupons();
  }
}
