import { Component, OnInit, ViewChild, Injector } from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AdminRequestServiceProxy,
  AdminCreateRequestDto,
  GetOfferPriceDto,
  AdminDriverDtoPagedResultDto,
  UserServiceProxy,
  AdminDriverServiceProxy,
  OfferPriceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { AppSessionService } from "@shared/session/app-session.service";
import { getCurrentLanguage } from "root.module";
import { NgxPrintModule } from "ngx-print";

@Component({
  selector: "app-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.scss"],
})
export class BillComponent extends AppComponentBase implements OnInit {
  _id: any;
  reservation: AdminCreateRequestDto = new AdminCreateRequestDto();
  items: MenuItem[];
  drivers: SelectItem[] = [];
  states: SelectItem[] = [];
  constructor(
    injector: Injector,
    private _reservationService: AdminRequestServiceProxy,
    private route: ActivatedRoute,
    private _router: Router,
    private appSessionService: AppSessionService,
    private driversServices: AdminDriverServiceProxy,
    private offerPriceService: OfferPriceServiceProxy,
    private userService: UserServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l("Reservations") },
      { label: this.l("ReservationDetails") },
    ];

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this._id = params["id"];
      }
    });
    if (this._id) {
      this.spinner.show();
      this._reservationService.get(this._id).subscribe((result) => {
        this.reservation = result;
        this.spinner.hide();
        this.initDrivers();
      });
    }
  }

  initDrivers() {
    const filterQuery = "";
    this.driversServices
      .getAll(
        filterQuery,
        undefined,
        undefined,
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        false
        ,
        "",
        0,
        1000
      )
      .pipe(finalize(() => {}))
      .subscribe((result: AdminDriverDtoPagedResultDto) => {
        const ReqResult = result.items;
        this.drivers = [];
        this.drivers.push({ label: this.l("Drivers"), value: null });
        ReqResult.forEach((element) => {
          this.drivers.push({ label: element.fullName, value: element.id });
        });
        const model = new GetOfferPriceDto();
        model.requestId = this._id;
        this.offerPriceService.offerPriceByRequestId(model).subscribe((res) => {
          const t = this.drivers.find((c) => c.value === res.driverId);
          this.drivers = [];
          this.drivers.push(t);
        });
      });
  }

  back() {
    this._router.navigate(["/app/reservations"]);
  }
  isUserInRole(roleName: string): boolean {
    let isInRole = false;
    this.userService
      .getUserRoles(this.appSessionService.user.id, roleName)
      .subscribe((response) => (isInRole = response));
    return isInRole;
  }

  //   print(): void {
  //     let printContents, popupWin;
  //     printContents = document.getElementById('toprint').innerHTML;
  //     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //     popupWin.document.open();
  //     popupWin.document.write(`
  //       <html>
  //         <head>
  //           <title>Print tab</title>
  //           <style>
  //           //........Customized style.......
  //           </style>
  //         </head>
  //     <body onload="window.print();window.close()">${printContents}</body>
  //       </html>`
  //     );
  //     popupWin.document.close();
  // }
}
