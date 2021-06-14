import {
  RoleServiceProxy,
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  CompanyServiceProxy,
  AdminDriverDto,
  DriverServiceProxy,
  AdminDriverServiceProxy,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  CompanyDtoPagedResultDto,
} from "../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import 'rxjs/add/observable/interval';
import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material";
import { message } from "@shared/Message/message";
import { Observable } from "rxjs";

@Component({
  selector: "app-newdrivers",
  templateUrl: "./newdrivers.component.html",
  styleUrls: ["./newdrivers.component.scss"],
})
export class NewDriversComponent extends AppComponentBase implements OnInit {
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

  drivers: AdminDriverDto[] = [];

  company: SelectItem;
  subcategory: SelectItem;
  subcategories: SelectItem[] = [];
  companies: SelectItem[] = [];
  IswaselDriver: any;
  IswaselVehicle: any;
  driversTotalCount: number;
  externalDriversTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;

  states: SelectItem[] = [];
  state: SelectItem;
currentDate:any;
  sorting: string;
  reset: any;
  sub:any;
  availabelEdit = false;
  constructor(
    injector: Injector,

    private translationService: TranslationService,
    private translate: TranslateService,
    private _driverService: AdminDriverServiceProxy,
    private _companyService: CompanyServiceProxy,
    private _subcategoryService: AdminSubategoryServiceProxy
  ) {
    super(injector);
    if (JSON.parse(localStorage.getItem("authenticateResult"))) {
      this.availabelEdit = JSON.parse(
        localStorage.getItem("authenticateResult")
      ).availableEditDelete;
    }
  }

  ngOnInit() {
    this.currentDate= new Date();
    //300000 => 5 minutes
    this.sub= Observable.interval(6000)
   
    .subscribe((val) => {    this.loadDrivers(); });
    this.initItems();
    this.initComps();

    this.initStates();
    this.loadDrivers();

    this.initSubs();
  
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
   // clearInterval(this.sub);
   
  }



  loadDrivers() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this.IswaselDriver = filetrObj["isWaselDriver"];
    this.IswaselVehicle = filetrObj["isWaselVehicle"];
    debugger;
    this._driverService
      .getAll(
        JSON.stringify(filetrObj),
        //this.name,
        this.company == null || this.company == undefined
          ? undefined
          : this.company.value,
        this.subcategory == null || this.subcategory == undefined
          ? undefined
          : this.subcategory.value,
        this.state == null || this.state == undefined
          ? undefined
          : this.state.value,
        this.IswaselDriver == null || this.IswaselDriver == undefined
          ? undefined
          : this.IswaselDriver,
        this.IswaselVehicle == null || this.IswaselVehicle == undefined
          ? undefined
          : this.IswaselVehicle,
          true
          ,
        this.sorting == "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        // console.log("test : ", filetrObj["IswaselDriver"]);

        this.drivers = res.items;
        this.totalCount = res.totalCount;
        this.spinner.hide();
      });
  }

  initSubs() {
    this._subcategoryService
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
    this.loadDrivers();
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

    this.loadDrivers();
  }

  initStates() {
    this.states.push({ label: "متاح", value: true });
    this.states.push({ label: "غير متاح", value: false });
  }
  initItems() {
    this.items = [{ label: this.l("Drivers") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "FullName", header: this.l("fullName") },
      { field: "Email", header: this.l("email") },
      { field: "Phone", header: this.l("phone") },
      { field: "CompanyName", header: this.l("Company") },
      { field: "isWaselDriver", header: this.l("IsWaselDriver") },
      { field: "isWaselVehicle", header: this.l("IsWaselVehicle") }
      ,
      {
        field: "CreationTime",
        header: this.l("RegisterDate"),
        isCalender: true,

      },
    ];
  }
  toggle(driverId, event: MatSlideToggleChange) {
    this._driverService.manageWaselDriver(driverId).subscribe((res) => {
      if (res.success) {
        message.Toast.fire(this.l(res.resultCode));
      } else {
        this.message.error(
          this.l(res.resultCode),
          this.l("SystemNotification")
        );
        this.drivers.find((x) => x.id === driverId).isWaselDriver = false;
      }
    });
    // console.log("driverId : ", driverId);
    // console.log("e : ", event.checked);
  }
  toggleVechile(driverId, event: MatSlideToggleChange) {
    this._driverService.manageWaselVehicle(driverId).subscribe((res) => {
      if (res.success) {
        message.Toast.fire(this.l(res.resultCode));
      } else {
        this.message.error(
          this.l(res.resultCode),
          this.l("SystemNotification")
        );
        this.drivers.find((x) => x.id === driverId).isWaselVehicle = false;
      }
    });
    // console.log("driverId : ", driverId);
    // console.log("e : ", event.checked);
  }
  resetFilters() {
    this.reset = $(".i-filter");
    this.reset.val("");
    this.subcategory = null;
    this.company = null;
    this.state = null;

    this.skipCount = 0;
    this.maxResultCount = 10;
    this.name = "";
    this.loadDrivers();
  }
  applyFilters() {
    debugger;
    this.skipCount = 0;
    this.loadDrivers();
  }
  // delete(personnel: PersonnelDto, tabNum) {
  //   message.Confirm.fire(
  //     "",
  //     this.translate.instant("AreYouSureDeleteRecord")
  //   ).then((willDelete) => {
  //     if (willDelete.value) {
  //       this._personnelService.delete(personnel.id).subscribe((res) => {
  //         message.Success.fire(
  //           "",
  //           this.translate.instant("DataDeletedSuccessfully")
  //         );
  //         switch (tabNum) {
  //           case 1:
  //             var index = this.vehicles.indexOf(personnel, 0);
  //             if (index > -1) {
  //               this.vehicles.splice(index, 1);
  //               this.totalCount = this.totalCount - 1;
  //             }
  //             break;
  //         }
  //       });
  //     }
  //   });
  // }
  sortData(event) {
    this.sorting = event.field + " " + (event.order == 1 ? " Asc" : " Desc");

    this.loadDrivers();
  }
}
