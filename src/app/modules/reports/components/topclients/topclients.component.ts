import { Component, OnInit, Injector } from '@angular/core';
import { AdminRequestServiceProxy, TopRequestSalesClientDto,AdminRequestDto } from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from '@shared/app-component-base';
import { MenuItem, SelectItem } from 'primeng/api';


@Component({
  selector: 'app-topclients',
  templateUrl: './topclients.component.html',
  styleUrls: ['./topclients.component.scss']
})
export class TopclientsComponent extends AppComponentBase implements OnInit {

 
  reset: any;
  skipCount: any;
  topClients: TopRequestSalesClientDto[] = [];
  constructor(injector: Injector, 
    private _reservationService: AdminRequestServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getTopRequestSalesClients();
  }

  getTopRequestSalesClients(  ) {
    let filetrObj :object = {};
    $('.i-filter').each((ind: number, elem: Element) => {
       filetrObj[$(elem).attr("name")]= $(elem).val();
    });
    debugger;
    this._reservationService
      .getTopRequestSalesClients(filetrObj["phone"],filetrObj["email"],filetrObj["firstName"],filetrObj["lastName"])
      .subscribe((res) => {
        this.topClients = res;
      });
  }
  resetFilters() {
    this.reset = $('.i-filter');
    this.reset.val('');
    this.getTopRequestSalesClients();
  }
  applyFilters() {
    this.skipCount = 0;
    this.getTopRequestSalesClients();
  }
}
