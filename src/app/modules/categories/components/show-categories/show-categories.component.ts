import {
  RoleServiceProxy,
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  AdminSubategoryServiceProxy,
} from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-show-categories",
  templateUrl: "./show-categories.component.html",
  styleUrls: ["./show-categories.component.scss"],
})
export class ShowCategoriesComponent
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

  categories: AdminCategoryDto[] = [];

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
  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private translationService: TranslationService,
    private translate: TranslateService,
    private _categoryService: AdminCategoryServiceProxy
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
    this.initItems();
    this.loadCategories();
  }

  loadCategories() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this._categoryService
      .getAll(
        // this.name ==null || this.name ==undefined?"":this.name,
        JSON.stringify(filetrObj),
        this.sorting == "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.categories = res.items;
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
    this.loadCategories();
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

    this.loadCategories();
  }
  initItems() {
    this.items = [{ label: this.l("Categories") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "Name", header: this.l("Name") },
      { field: "NameAr", header: this.l("NameAr") },
      { field: "NameFa", header: this.l("NameFa") },
    ];
  }

  resetFilters() {
    this.reset = $(".i-filter");
    this.reset.val("");
    this.branch = null;
    this.name = "";
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.loadCategories();
  }

  applyFilters() {
    this.skipCount = 0;
    this.loadCategories();
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

    this.loadCategories();
  }
}
