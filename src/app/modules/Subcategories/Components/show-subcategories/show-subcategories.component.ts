import {
  RoleServiceProxy,
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  AdminSubategoryServiceProxy,
  AdminCategoryDtoPagedResultDto,
} from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-show-subcategories",
  templateUrl: "./show-subcategories.component.html",
  styleUrls: ["./show-subcategories.component.scss"],
})
export class ShowSubcategoriesComponent
  extends AppComponentBase
  implements OnInit {
  tabNum = 1;
  items: MenuItem[];
  selectedCars3: any[];
  personnelsCols: any[];
  cars: any[];
  cars2: any[];

  roles: SelectItem[] = [];
  departments: SelectItem[] = [];
  categories: SelectItem[] = [];
  personalStatuses: SelectItem[] = [];

  role: SelectItem;
  department: SelectItem;
  category: SelectItem;
  personalStatus: SelectItem;

  employees: AdminSubcategoryDto[] = [];

  employeesTotalCount: number;
  externalEmployeesTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;

  name: string;
  reset: any;
  availabelEdit = false;
  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private translationService: TranslationService,
    private translate: TranslateService,
    private _subcategoryService: AdminSubategoryServiceProxy,
    private _categoryService: AdminCategoryServiceProxy
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
    this.initCatss();
    this.loadEmployees();
  }

  loadEmployees() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this._subcategoryService
      .getAll(
        "",
        this.category == null || this.category == undefined
          ? undefined
          : this.category.value,
        JSON.stringify(filetrObj),
        // this.name == "" ? undefined : this.name,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.employees = res.items;
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
    this.loadEmployees();
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

    this.loadEmployees();
  }
  initItems() {
    this.items = [{ label: this.l("SubCategories") }];
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

  initCatss() {
    this._categoryService
      .getAll("", "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminCategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.categories = [];
        this.categories.push({ label: this.l("category"), value: null });
        ReqResult.forEach((element) => {
          this.categories.push({ label: element.name, value: element.id });
        });
      });
  }
  resetFilters() {
    this.reset = $(".i-filter");
    this.reset.val("");
    this.category = null;
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.loadEmployees();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadEmployees();
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
    this.name = event.field + " " + (event.order == 1 ? " Asc" : " Desc");

    this.loadEmployees();
  }
}
