import {
  RoleServiceProxy,
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  CompanyServiceProxy,
  CompanyDto,
  AdminVechileServiceProxy,
  AdminVechileDto,
} from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-show-vechiles",
  templateUrl: "./show-vechiles.component.html",
  styleUrls: ["./show-vechiles.component.scss"],
})
export class ShowVechilesComponent extends AppComponentBase implements OnInit {
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

  Vechiles: AdminVechileDto[] = [];

  VechilesTotalCount: number;
  externalVechilesTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;
  availabelEdit = false;
  sorting: string;
  reset: any;
  constructor(
    injector: Injector,

    private translationService: TranslationService,
    private translate: TranslateService,
    private _companyService: AdminVechileServiceProxy
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

    this.loadVechiles();
  }

  loadVechiles() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });

    this._companyService
      .getAll(
        JSON.stringify(filetrObj),
        // this.name,
        this.sorting === "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.Vechiles = res.items;
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
    this.loadVechiles();
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

    this.loadVechiles();
  }
  initItems() {
    this.items = [{ label: this.l("Vechiles") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "Plate", header: this.l("Plate") },
      { field: "PlateTypeName", header: this.l("PlateType") },
      { field: "SequenceNumber", header: this.l("SequenceNumber") },
    ];
  }

  resetFilters() {
    this.reset = $(".i-filter");
    this.reset.val("");
    this.branch = null;
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.name = "";
    this.loadVechiles();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadVechiles();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order === 1 ? " Asc" : " Desc");

    this.loadVechiles();
  }
}
