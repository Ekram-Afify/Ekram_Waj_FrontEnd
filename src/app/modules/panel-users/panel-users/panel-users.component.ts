import {
  AdminClientDto,
  AdminPanelUserServiceProxy,
} from "./../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material";
import { message } from "../../../../shared/Message/message";

@Component({
  selector: "app-panel-users",
  templateUrl: "./panel-users.component.html",
  styleUrls: ["./panel-users.component.scss"],
})
export class PanelUsersComponent extends AppComponentBase implements OnInit {
  tabNum = 1;
  availabelEdit = false;
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
  manageActive = {
    panelUserId: null,
  };
  customers = [];

  customersTotalCount: number;
  externalCustomersTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;

  sorting: string;
  reset: any;

  constructor(
    injector: Injector,

    private translationService: TranslationService,
    private translate: TranslateService,
    private _PanelService: AdminPanelUserServiceProxy
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

    this.loadCustomers();
  }

  loadCustomers() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this._PanelService
      .getAll(
        //this.name,
        JSON.stringify(filetrObj),
        filetrObj["roleId"] == null ||
          filetrObj["roleId"] === undefined ||
          filetrObj["roleId"] == "0"
          ? undefined
          : parseInt(filetrObj["roleId"]),
        this.sorting == "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.customers = res.items;
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
    this.loadCustomers();
  }
  toggle(userId, event: MatSlideToggleChange) {
    debugger;
    console.log(userId)
    this.manageActive.panelUserId = userId;
    this._PanelService.manageAvailable(userId).subscribe((res) => {
      // if (res) {
      //   message.Toast.fire(this.l(res.resultCode));
      // } else {
      //   this.message.error(
      //     this.l(res.error?.message),
      //     this.l("SystemNotification")
      //   );
      // }
    });
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

    this.loadCustomers();
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
      { field: "roleId", header: this.l("Role") },
      { field: "userName", header: this.l("UserName") },
      { field: "Email", header: this.l("email") },
      { field: "Phone", header: this.l("phone") },
      { field: "AvailableEditDelete", header: this.l("AvailableEditDelete") },
      { field: "CreationTime", header: this.l("CreationTime") },
    ];
  }

  removeUser(User) {
    this.message.confirm(
      this.l("DeleteConfirmation"),
      this.l("SystemNotification"),
      (result) => {
        if (result) {
          this._PanelService
            .delete(User)
            .pipe(finalize(() => {}))
            .subscribe((res: any) => {
              if (!res) {
                // this.message.success(this.l('RemovedCoupon'), this.l('SystemNotification'));
                this.loadCustomers();
              } else {
                this.message.error(
                  this.l("CannotRemoveUser"),
                  this.l("SystemNotification")
                );
              }
            });
        }
      }
    );
  }
  resetFilters() {
    this.reset = $(".i-filter");
    this.branch = null;
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.name = "";
    this.reset.val("");
    this.loadCustomers();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadCustomers();
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

    this.loadCustomers();
  }
}
