import {
  AdminCategoryDto,
  AdminCategoryServiceProxy,
  AdminSubcategoryDto,
  CompanyServiceProxy,
  RequestDto,
  RequestServiceProxy,
  AdminRequestServiceProxy,
  RequestStatusServiceProxy,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  CompanyDtoPagedResultDto,
  AdminRequestDto,
  CompanyDriversReuestsServiceProxy,
  CompanyDriversReuestDto,
} from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { getCurrentLanguage } from "root.module";
import { ActivatedRoute } from "@angular/router";
import { interval, Observable } from "rxjs";

@Component({
  selector: "app-show-client-company-reservations",
  templateUrl: "./show-client-company-reservations.component.html",
  styleUrls: ["./show-client-company-reservations.component.scss"],
})
export class ShowClientCompanyReservationsComponent
  extends AppComponentBase
  implements OnInit {
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

  reservations:CompanyDriversReuestDto[] = [];

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
  requestId;
  availabelEdit = false;
  sub: any;
  category: any;
  filetrObj:Object= {};
  constructor(
    injector: Injector,
    private translationService: TranslationService,
   // private modalService: NgbModal,
    private translate: TranslateService,
    private _reservationService: CompanyDriversReuestsServiceProxy,
    private _subcategoriesService: AdminSubategoryServiceProxy,
    private _companyService: CompanyServiceProxy,
    private route: ActivatedRoute,
    private _requestStatusServiceProxy: RequestStatusServiceProxy
  ) {
    super(injector);
    if (JSON.parse(localStorage.getItem("authenticateResult"))) {
      this.availabelEdit = JSON.parse(
        localStorage.getItem("authenticateResult")
      ).availableEditDelete;
    }
    this.route.queryParams.subscribe((params) => {
      // console.log("params : ", params);

      if (params["requestId"]) {
        this.requestId = params["requestId"];
        // console.log("requestId : ", params["requestId"]);
      }
    });
  }

  ngOnInit() {
 
  
    this.initItems();
    this.initSubs();
   // this.initComps();
    //this.initStates();
    this.loadReservations(); 
    // lood  new reservation 
    interval(6000).subscribe(
      (value: number) => {
        this.loadReservations(); 
      },
      (error: any) => {
        console.log('error');
      },
      () => {
        console.log('observable completed !');
      }
    );
  
  }

  loadReservations() {
    this.spinner.show();
    
    debugger;

    // this.state = this.filetrObj["state"];
    if (this.requestId && !this.filetrObj["Id"] && this.filetrObj!=undefined) {
    
      console.log("requestId : ", this.requestId);

      this.filetrObj["Id"] = this.requestId;
    }

    this._reservationService
      .getAll(
       
        this.subcategory == null || this.subcategory === undefined
          ? undefined
          : this.subcategory.value,
         undefined,
        this.company == null || this.company === undefined
          ? undefined
          : this.company.value,
         
        JSON.stringify(this.filetrObj),
        this.sorting === "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        debugger;
        this.reservations = res.items
        console.log("reservations : ", this.reservations);

        this.totalCount = res.totalCount;
        debugger;
        this.spinner.hide();
      });
  }

  // initComps() {
  //   this._companyService
  //     .getAll("", "", 0, 1000)
  //     .pipe(finalize(() => {}))
  //     .subscribe((result: CompanyDtoPagedResultDto) => {
  //       const ReqResult = result.items;

  //       this.companies = [];
  //       this.companies.push({ label: this.l("Company"), value: null });
  //       ReqResult.forEach((element) => {
  //         this.companies.push({ label: element.name, value: element.id });
  //       });
  //     });
  // }

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
      { field: "Id", header: this.l("ReservatiobId") },
      { field: "Category", header: this.l("Category") },
      { field: "Subcategory", header: this.l("SubCategory") },
      { field: "StratingPointTitle", header: this.l("startingPoint") },
      { field: "EndingPointTitle", header: this.l("endingPoint") },
      { field: "customerName", header: this.l("customerName") },
      // { field: "Net", header: this.l("DeliveryCost"), stopFilter: true },
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
    this.filetrObj=undefined;
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
    //
    this.filetrObj = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      if ($(elem).hasClass("table-dropdown-satus")) {
       
        this.filetrObj[$(elem).attr("name")] = $(elem).find(":selected").val();
      } else this.filetrObj[$(elem).attr("name")] = $(elem).val();
    });
    this.skipCount = 0;
    this.loadReservations();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order === 1 ? " Asc" : " Desc");

    this.loadReservations();
  }
  // openGroupInfo(contentClientDetails)
  // {

    
  
  //   this.modalService.open(contentClientDetails).result.then(
  //     result => {
  //       this.closeResult = `Closed with: ${result}`;
  //     },
  //     reason => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     }
  //   );

  // }


 
}
