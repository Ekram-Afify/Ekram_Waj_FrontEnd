import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { PaymentServiceProxy } from "../../../../shared/service-proxies/service-proxies";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-payment-details",
  templateUrl: "./payment-details.component.html",
  styleUrls: ["./payment-details.component.scss"],
})
export class PaymentDetailsComponent
  extends AppComponentBase
  implements OnInit {
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

  payments = [];

  customersTotalCount: number;
  externalCustomersTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;
  PaymentId;
  sorting: string;
  reset: any;
  payDetails;
  constructor(
    injector: Injector,

    private translationService: TranslationService,
    private translate: TranslateService,
    private _route: ActivatedRoute,
    private _paymentsService: PaymentServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.PaymentId = params["id"];
      this.initItems();

      this.loadPayments();
    });
  }

  loadPayments() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this._paymentsService.getPaymentDetails(this.PaymentId).subscribe((res) => {
      console.log("payment details : ", res);
      this.payDetails = res;
      this.payments = res.paymentDetails;
      // this.totalCount = res.totalCount;
      this.spinner.hide();
    });
  }
  printPage() {
    window.print();
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

    var rest = this.totalCount - this.skipCount;
    if (rest <= event.rows) {
      this.rowsEndCount = this.totalCount;
    } else {
      this.rowsEndCount = event.first + event.rows;
    }
    this.rowsFirstCount = event.first + 1;

    this.loadPayments();
  }
  initItems() {
    this.items = [{ label: this.l("Customers") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "paymentNumber", header: this.l("PaymentNumber") },
      { field: "payValue", header: this.l("PayValue") },
      { field: "paymentType", header: this.l("PayType") },
      { field: "creationTime", header: this.l("CreationTime") },
    ];
  }

  resetFilters() {
    this.reset = $(".i-filter");
    this.branch = null;
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.name = "";
    this.reset.val("");
    this.loadPayments();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadPayments();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order == 1 ? " Asc" : " Desc");

    this.loadPayments();
  }
}
