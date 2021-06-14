import {
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  CompanyServiceProxy,
  RequestDto,
  RequestServiceProxy,
  AdminRequestServiceProxy,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  CompanyDtoPagedResultDto,
  AdminRequestDto,
  RequestStatusServiceProxy,
} from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { getCurrentLanguage } from "root.module";

@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.scss"],
})
export class ReservationComponent extends AppComponentBase implements OnInit {
  tabNum = 1;
  items: MenuItem[];
  selectedCars3: any[];
  personnelsCols: any[];
  cars: any[];
  cars2: any[];

  departments: SelectItem[] = [];
  subcategories: SelectItem[] = [];
  states: SelectItem[] = [];

  status: any;
  state: SelectItem;
  subcategory: SelectItem;

  personalStatus: SelectItem;

  reservations: AdminRequestDto[] = [];

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
    private _reservationService: AdminRequestServiceProxy,
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
    this.initStates();
    this.loadReservations();
  }
  loadReservations() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      if ($(elem).hasClass("table-dropdown-satus")) {
        filetrObj[$(elem).attr("name")] = $(elem).find(":selected").val();
      } else filetrObj[$(elem).attr("name")] = $(elem).val();
    });

    var _stat = filetrObj["state"];
    this._reservationService
      .getAll(
        _stat == null || _stat === undefined || _stat == ""
          ? undefined
          : parseInt(filetrObj["state"]),
        this.subcategory == null || this.subcategory === undefined
          ? undefined
          : this.subcategory.value,
        this.company == null || this.company === undefined
          ? undefined
          : this.company.value,
        JSON.stringify(filetrObj),
        false,
        // this.name == null || this.name === undefined ? '' : this.name,
        this.sorting === "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.reservations = res.items;
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

  initStates() {
    this._requestStatusServiceProxy
      .getAllRequestStatus()
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        const statesResult = result;
        statesResult.forEach((element) => {
          this.states.push({
            label:
              getCurrentLanguage() === "en" ? element.nameEn : element.nameAr,
            value: element.id,
          });
        });
      });

    // this.states.push({ label: this.l('new'), value: 2 });
    // this.states.push({ label: this.l('priceDisplayed'), value: 3 });
    // this.states.push({ label: this.l('deliveredHanded'), value: 4 });
    // this.states.push({ label: this.l('canceledDone'), value: 5 });
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
    this.loadReservations();
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

    this.loadReservations();
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
      { field: "Subcategory", header: this.l("SubCategory") },
      { field: "StratingPointTitle", header: this.l("stratingPointTitle") },
      { field: "EndingPointTitle", header: this.l("endingPointTitle") },
      { field: "CompanyName", header: this.l("Company") },
      { field: "RequestStateName", header: this.l("Status") },
      { field: "AcceptedDriverName", header: this.l("Drivers") },
      {
        field: "DeliveryCost",
        header: this.l("DeliveryCost"),
        stopFilter: true,
      },
      { field: "VATAmount", header: this.l("VATAmount"), stopFilter: true },
      { field: "Net", header: this.l("Net"), stopFilter: true },
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
    this.state = null;
    this.company = null;
    this.name = "";
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.status = "";
    this.loadReservations();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadReservations();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order === 1 ? " Asc" : " Desc");

    this.loadReservations();
  }

  cancelRequest(request) {
    this.message.confirm(
      this.l("DeleteConfirmation"),
      this.l("SystemNotification"),
      (result) => {
        if (result) {
          this._reservationService
            .cancelRequestFromAdminPanel(request)
            .pipe(finalize(() => {}))
            .subscribe((res) => {
              if (!res) {
                this.message.error(
                  this.l("CannotCancel"),
                  this.l("SystemNotification")
                );
              } else {
                this.message.success(
                  this.l("CancelSuccessfully", request),
                  this.l("SystemNotification")
                );
                this.loadReservations();
              }
            });
        }
      }
    );
  }
}
