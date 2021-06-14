import {
  CompanyServiceProxy,
  AdminSubategoryServiceProxy,
  PaymentServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  CompanyDtoPagedResultDto,
  AdminRequestDto,
  RequestStatusServiceProxy,
} from "./../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { getCurrentLanguage } from "root.module";

@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
})
export class PaymentsComponent extends AppComponentBase implements OnInit {
  tabNum = 1;
  items: MenuItem[];
  selectedCars3: any[];
  personnelsCols: any[];
  cars: any[];
  cars2: any[];

  departments: SelectItem[] = [];
  subcategories: SelectItem[] = [];

  status: any;
  subcategory: SelectItem;

  personalStatus: SelectItem;

  payments = [];

  reservationsTotalCount: number;
  externalCompaniesTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  company: SelectItem;
  companies: SelectItem[] = [];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;
  name: any;
  sorting: string;
  reset: any;
  constructor(
    injector: Injector,
    private translationService: TranslationService,
    private translate: TranslateService,
    private _paymentsService: PaymentServiceProxy,
    private _subcategoriesService: AdminSubategoryServiceProxy,
    private _companyService: CompanyServiceProxy,
    private _requestStatusServiceProxy: RequestStatusServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.initItems();
    this.initSubs();
    this.initComps();
    this.loadPayments();
  }
  loadPayments() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      if ($(elem).hasClass("table-dropdown-satus")) {
        filetrObj[$(elem).attr("name")] = $(elem).find(":selected").val();
      } else filetrObj[$(elem).attr("name")] = $(elem).val();
    });

    // var _stat = filetrObj["state"];
    this._paymentsService
      .getAll(
        JSON.stringify(filetrObj),
        filetrObj["usedCoupon"] ? filetrObj["usedCoupon"] : undefined,
        filetrObj["ClientName"],
        filetrObj["DriverName"],
        filetrObj["cost"],
        filetrObj["requestId"],
        // this.name == null || this.name === undefined ? '' : this.name,
        this.sorting === "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        console.log("payments : ", res);

        this.payments = res.items;
        this.totalCount = res.totalCount;
        debugger;
        this.spinner.hide();
      });
  }

  initComps() {
    this._companyService
      .getAll("", "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.companies = [];
        this.companies.push({ label: this.l("Company"), value: null });
        ReqResult.forEach((element) => {
          this.companies.push({ label: element.name, value: element.id });
        });
      });
  }

  showMenuItem(permissionName): boolean {
    return this.permission.isGranted(permissionName);
  }

  initSubs() {
    this._subcategoriesService
      .getAll("", undefined, "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.subcategories = [];
        this.subcategories.push({ label: this.l("SubCategory"), value: null });
        ReqResult.forEach((element) => {
          this.subcategories.push({ label: element.name, value: element.id });
        });
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
    this.loadPayments();
  }

  paginate(event) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;

    const rest = this.totalCount - this.skipCount;
    if (rest <= event.rows) {
      this.rowsEndCount = this.totalCount;
    } else {
      this.rowsEndCount = event.first + event.rows;
    }
    this.rowsFirstCount = event.first + 1;

    this.loadPayments();
  }
  initItems() {
    this.items = [{ label: this.l("Reservations") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "requestId", header: this.l("ReservatiobId") },
      { field: "cost", header: this.l("Cost") },
      { field: "usedCoupon", header: this.l("usedCoupon") },
      { field: "DriverName", header: this.l("DriverName") },
      { field: "ClientName", header: this.l("customerName") },
      {
        field: "CreationTime",
        header: this.l("CreationTime"),
        isCalender: true,
      },
    ];
  }

  resetFilters() {
    this.reset = $(".i-filter");
    this.reset.val("");
    this.subcategory = null;
    this.company = null;
    this.name = "";
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.status = "";
    this.loadPayments();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadPayments();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order === 1 ? " Asc" : " Desc");

    this.loadPayments();
  }

  // cancelRequest(request) {
  //   this.message.confirm(
  //     this.l("DeleteConfirmation"),
  //     this.l("SystemNotification"),
  //     (result) => {
  //       if (result) {
  //         this._paymentsService
  //           .(request)
  //           .pipe(finalize(() => {}))
  //           .subscribe((res) => {
  //             if (!res) {
  //               this.message.error(
  //                 this.l("CannotCancel"),
  //                 this.l("SystemNotification")
  //               );
  //             } else {
  //               this.message.success(
  //                 this.l("CancelSuccessfully", request),
  //                 this.l("SystemNotification")
  //               );
  //               this.loadPayments();
  //             }
  //           });
  //       }
  //     }
  //   );
  // }
}
