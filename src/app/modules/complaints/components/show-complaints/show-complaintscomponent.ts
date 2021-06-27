import {
  RoleServiceProxy,
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  AdminSubategoryServiceProxy,
  ComplaintServiceProxy,
  ComplaintDto,
} from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-show-complaints",
  templateUrl: "./show-complaints.component.html",
  styleUrls: ["./show-complaints.component.scss"],
})
export class ShowComplaintsComponent
  extends AppComponentBase
  implements OnInit {
  tabNum = 1;
  items: MenuItem[];
  selectedCars3: any[];
  personnelsCols: any[];
  cars: any[];
  cars2: any[];
  availabelEdit = false;
  roles: SelectItem[] = [];
  departments: SelectItem[] = [];
  branches: SelectItem[] = [];
  personalStatuses: SelectItem[] = [];

  role: SelectItem;
  department: SelectItem;
  branch: SelectItem;
  personalStatus: SelectItem;

  complaints: ComplaintDto[] = [];

  categoriesTotalCount: number;
  externalCategoriesTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];
  name: any;

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;

  sorting: string;
  reset: any;
  filetrObj: object = {};
  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private translationService: TranslationService,
    private translate: TranslateService,
    private _complaintService: ComplaintServiceProxy
  ) {
    super(injector);
    if (JSON.parse(localStorage.getItem("authenticateResult"))) {
      this.availabelEdit = JSON.parse(
        localStorage.getItem("authenticateResult")
      ).availableEditDelete;
    }
  }

  // getFilter :string()
  // {

  // }

  ngOnInit() {
    this.filetrObj={};
    this.initItems();
    this.loadComplaints();
  }

  loadComplaints() {
    this.spinner.show();
    
  
    this._complaintService
      .getAll(
        // this.name ==null || this.name ==undefined?"":this.name,
        JSON.stringify(this.filetrObj),
        this.sorting == "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.complaints = res.items;
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
    this.loadComplaints();
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

    this.loadComplaints();
  }
  initItems() {
    this.items = [{ label: this.l("Complaints") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "fullName", header: this.l("FullName") },
     
      { field: "phoneNymber", header: this.l("PhoneNumber") },
      { field: "description", header: this.l("ComplaintDesc") },
      { field: "createdDate", header: this.l("CreationTime") },
    ];
  }

  resetFilters() {
    this.reset = $(".i-filter");

    this.reset.val("");
    this.filetrObj=undefined;
    this.branch = null;
    this.name = "";
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.loadComplaints();
  }

  applyFilters() {
    this.filetrObj = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      this.filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this.skipCount = 0;
    this.loadComplaints();
  }
 
  sortData(event) {
    this.sorting = event.field + " " + (event.order == 1 ? " Asc" : " Desc");

    this.loadComplaints();
  }
}
