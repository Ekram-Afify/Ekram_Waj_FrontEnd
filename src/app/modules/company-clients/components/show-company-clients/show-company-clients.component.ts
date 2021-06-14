import {  RoleServiceProxy, AdminSubcategoryDto, AdminSubategoryServiceProxy, AdminCompanyClientServiceProxy, AdminCompanyClientDto, CompanyServiceProxy, CompanyDtoPagedResultDto } from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";

import { TranslationService } from "@shared/services/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { finalize } from "rxjs/operators";
@Component({
  selector: 'app-show-company-clients',
  templateUrl: './show-company-clients.component.html',
  styleUrls: ['./show-company-clients.component.scss']
})
export class ShowCompanyClientsComponent extends AppComponentBase implements OnInit {
  tabNum = 1;
  items: MenuItem[];
  selectedCars3: any[];
  personnelsCols: any[];
  cars: any[];
  cars2: any[];

  roles: SelectItem[] = [];
  departments: SelectItem[] = [];
  branches: SelectItem[] = [];
  companies: SelectItem[] = [];

  role: SelectItem;
  department: SelectItem;
  branch: SelectItem;
  company: SelectItem;
  name:any;

  companyClients: AdminCompanyClientDto[] = [];

  companyClientsTotalCount: number;
  externalCategoriesTotalCount: number;

  totalCount: number;
  TheNumberOfLinePerPage: any[];

  rowTable = 10;
  rowsEndCount = 10;
  rowsFirstCount = 1;
  maxResultCount: any;
  skipCount: any;

  sorting: string;
  constructor(injector: Injector,
    private _roleService: RoleServiceProxy,
    private translationService: TranslationService,
    private translate: TranslateService,
    private _companyClientService: AdminCompanyClientServiceProxy,
    private _companyService: CompanyServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.initComps();
    this.initItems();
debugger;
    this.loadCompanyClients();
  }

  loadCompanyClients() {
    this._companyClientService
      .getAll(
        this.name,
        this.company ==null || this.company ==undefined ? undefined :this.company.value,
        this.sorting == "" ? undefined : this.sorting,
        this.skipCount,
        this.maxResultCount
      )
      .subscribe((res) => {
        this.companyClients = res.items;

        this.totalCount = res.totalCount;
      });
  }

  initComps() {
    this._companyService
      .getAll("",
      "",
      0,1000)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result : CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.companies = [];
        this.companies.push({ label: this.l('Companyy'), value: null });
        ReqResult.forEach(element => {
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
    this.loadCompanyClients();
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
    
    this.loadCompanyClients();
        
  }
  initItems() {
    this.items = [{ label: this.l('CompanyClients') }];
    this.TheNumberOfLinePerPage = [
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 },
      { label: "25", value: 25 },
      { label: "30", value: 30 },
    ];
    this.personnelsCols = [
      { field: "FullName", header: this.l('fullName') },
      { field: "Phone", header: this.l('phone') },
      { field: "Email", header: this.l('email') },
    ];
  }

  

  resetFilters() {
        this.company = null;
        this.name="";
        this.skipCount = 0;
        this.maxResultCount = 10;
        this.loadCompanyClients();
  }
  applyFilters() {
        this.skipCount = 0;
        this.loadCompanyClients();
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
    
    this.loadCompanyClients();
    
  }
}
