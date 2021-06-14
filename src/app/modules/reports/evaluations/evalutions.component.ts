import {


  AdminOfferPriceServiceProxy,

} from "./../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
import { getCurrentLanguage } from "root.module";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-evaluations",
  templateUrl: "./evaluations.component.html",
  styleUrls: ["./evaluations.component.scss"],
})
export class EvaluationsComponent extends AppComponentBase implements OnInit {
  items: MenuItem[];
  personnelsCols: any[];
  personalStatus: SelectItem;
  evaluations = [];
  totalCount: number;
  TheNumberOfLinePerPage: any[];
  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;
  name: any;
  sorting: string;
  reset: any;
  IsClient:any;
  Rate:any;
  DriverName:any;
  ClientName:any;
  RequestId:any;
  constructor(
    injector: Injector,
    private translationService: TranslationService,
    private translate: TranslateService,
    private _evaluationsService: AdminOfferPriceServiceProxy,
    private route: ActivatedRoute,private _router: Router
  ) {
    super(injector);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
debugger;
        this.IsClient = params['isClient'];

    });
    this.initItems();


    this.loadEvalutions();
  }

  loadEvalutions() {
    this.spinner.show();
    let filetrObj: object = {};
    $(".i-filter").each((ind: number, elem: Element) => {
      if ($(elem).hasClass("table-dropdown-satus")) {
        filetrObj[$(elem).attr("name")] = $(elem).find(":selected").val();
      } else filetrObj[$(elem).attr("name")] = $(elem).val();
    });

    this.RequestId = filetrObj["RequestId"];
    this.DriverName = filetrObj["DriverName"];
    this.ClientName = filetrObj["ClientName"];
    this.Rate = filetrObj["Rate"];

    this._evaluationsService
      .getAll(
        JSON.stringify(filetrObj),
        (this.RequestId===null||this.RequestId==undefined)?undefined:this.RequestId,
       (this.ClientName==="" ||this.ClientName==undefined )?undefined:this.ClientName,
        (this.DriverName==="" || this.DriverName==undefined)?undefined:this.DriverName,
        this.Rate===null?undefined:this.Rate,this.IsClient,
        this.sorting === "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        debugger;
        console.log(res.items)
        this.evaluations = res.items;
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
    this.loadEvalutions();
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

    this.loadEvalutions();
  }
  initItems() {
    this.items = this.IsClient?[{ label: this.l("ClientsEvaluations") }]:[{ label: this.l("DriversEvaluations") }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "RequestId", header: this.l("ReservatiobId") },
      { field: "DriverName", header: this.l("DriverName") },
      { field: "ClientName", header: this.l("customerName") },
      { field: "Rate", header: this.l("Rate") },

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
    this.name = "";
    this.skipCount = 0;
    this.maxResultCount = 10;
    this.loadEvalutions();
  }
  applyFilters() {
    this.skipCount = 0;
    this.loadEvalutions();
  }

  sortData(event) {
    this.sorting = event.field + " " + (event.order === 1 ? " Asc" : " Desc");

    this.loadEvalutions();
  }


}
