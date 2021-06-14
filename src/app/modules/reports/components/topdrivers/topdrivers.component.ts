import { Component, OnInit,Injector } from '@angular/core';
import { AdminOfferPriceServiceProxy, TopRequestSalesDriverDto } from "./../../../../../shared/service-proxies/service-proxies";
import { AppComponentBase } from '@shared/app-component-base';
@Component({
  selector: 'app-topdrivers',
  templateUrl: './topdrivers.component.html',
  styleUrls: ['./topdrivers.component.scss']
})
export class TopdriversComponent extends AppComponentBase implements OnInit {
  reset: any;
  skipCount: any;
  topDrivers: TopRequestSalesDriverDto[] = [];
  constructor(injector: Injector, 
    private _reservationService: AdminOfferPriceServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getTopRequestSalesDrivers();
  }

  getTopRequestSalesDrivers() {
   
    let filetrObj :object = {};
    $('.i-filter').each((ind: number, elem: Element) => {
       filetrObj[$(elem).attr("name")]= $(elem).val();
    });
  
    this._reservationService
      .getTopRequestSalesDrivers(filetrObj["name"],filetrObj["email"],filetrObj["phone"])
      .subscribe((res) => {
        this.topDrivers = res;
        debugger;
      });
  }
  resetFilters() {
    this.reset = $('.i-filter');
    this.reset.val('');
    this.getTopRequestSalesDrivers();
  }
  applyFilters() {
    this.skipCount = 0;
    this.getTopRequestSalesDrivers();
  }
}
