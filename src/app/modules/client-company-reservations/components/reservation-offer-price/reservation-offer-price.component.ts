import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Injector,
} from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AdminRequestServiceProxy,
  AdminCreateRequestDto,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  GetOfferPriceDto,
  UserServiceProxy,
  AdminDriverServiceProxy,
  OfferPriceServiceProxy,
  SelectedDriver,
  RequestWOfferPriceDto,
  CreateOfferPriceDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { AppSessionService } from "@shared/session/app-session.service";
import { getCurrentLanguage } from "root.module";
import { message } from "@shared/Message/message";

@Component({
  selector: "app-reservation-offer-price",
  templateUrl: "./reservation-offer-price.component.html",
  styleUrls: ["./reservation-offer-price.component.scss"],
})
export class ReservationOfferPriceComponent extends AppComponentBase implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;

  _id: any;
  destinationAddress;
  destinationlatitude: any;
  destinationlongitude: any;
  zoom: any = 12;
  geoCoder: any;
  subcategories: SelectItem[] = [];
  pickupAddress: any;
  pickuplatitude: any;
  pickuplongitude: any;
  offerPrice:CreateOfferPriceDto= new CreateOfferPriceDto();
  reservation: AdminCreateRequestDto = new AdminCreateRequestDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  PdfFile: File;
  drivers: SelectItem[] = [];
  states: SelectItem[] = [];
  basicFormGroupSupportingfiles: FormGroup;
 

  reqId: string;
  origin: any;
  model: GetOfferPriceDto = new GetOfferPriceDto();
  destination: any;
  driverId: number=0;
  deliveryCost: number;
  dilevryhr:string="0";
  dilevrymn:string="0";
  dilevrysc:string="0";
  sub:any;
  constructor(
    injector: Injector,
    private _formBuilder: FormBuilder,
    private _reservationService: AdminRequestServiceProxy,
    private route: ActivatedRoute,
    private _router: Router,
    private maps: MapsAPILoader,
    private _subcategoryService: AdminSubategoryServiceProxy,
    private appSessionService: AppSessionService,
    private driversServices: AdminDriverServiceProxy,
    private offerPriceService: OfferPriceServiceProxy,
    private userService: UserServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {

    
    this.items = [
      { label: this.l("CompanyDriversRequests") },
      { label: this.l("ReservationDetails") },
    ];

    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ["", Validators.required],
      FileDescription: [""],
    });

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this._id = params["id"];
      }
    });
    if (this._id) {
      this._reservationService.get(this._id).subscribe((result) => {
        this.reservation = result;
        this.destinationlatitude = this.reservation.startingPoint.split(",")[1];
        this.destinationlongitude = this.reservation.startingPoint.split(
          ","
        )[0];
        this.pickuplatitude = this.reservation.endingPoint.split(",")[1];
        this.pickuplongitude = this.reservation.endingPoint.split(",")[0];

        this.getDirection();
        this.initCatss();
        this.initDrivers();
        this.initStates();

    
      });
    }
  }
  intailOfferPrice() {
 
    this.offerPrice.deliveryThroughHours=parseInt(this.dilevryhr)   ;
    this.offerPrice.deliveryThroughMinutes=parseInt(this.dilevrymn);
    this.offerPrice.deliveryThroughSeconds=parseInt(this.dilevrysc);

  }
  initCatss() {
    this._subcategoryService
      .getAll("", undefined, "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.subcategories = [];
        this.subcategories.push({ label: this.l("category"), value: null });
        ReqResult.forEach((element) => {
          this.subcategories.push({
            label:
              getCurrentLanguage() === "en" ? element.name : element.nameAr,
            value: element.id,
          });
        });

        const t = this.subcategories.find(
          (c) => c.value === this.reservation.subcategoryId
        );
        this.subcategories = [];
        this.subcategories.push(t);
      });
  }
 

  initDrivers() {
    this.driversServices
      .getUnPricedDrivers()
      .pipe(finalize(() => {}))
      .subscribe((result: SelectedDriver[]) => {
        const ReqResult = result;
        debugger;
        this.drivers = [];
        this.drivers.push({ label: "", value: null });
        ReqResult.forEach((element) => {
          this.drivers.push({
            label:element.name,
            value: element.id,
          });
        });
      });
  }
  initStates() {
    this.states.push({ label: this.l("Status"), value: null });
    this.states.push({ label: this.l("Schedule"), value: 1 });
    this.states.push({ label: this.l("Schedule"), value: 2 });
    this.states.push({ label: this.l("Current"), value: 3 });
    this.states.push({ label: this.l("Previous"), value: 4 });
    this.states.push({ label: this.l("Cancelled"), value: 5 });

    const t = this.states.find((c) => c.value === this.reservation.status);
    this.states = [];
    this.states.push(t);
  }
  clearInput(name) {}



  back() {
    this._router.navigate(["/app/client-company-reservations"]);
  }



  isUserInRole(roleName: string): boolean {
    let isInRole = false;
    this.userService
      .getUserRoles(this.appSessionService.user.id, roleName)
      .subscribe((response) => (isInRole = response));
    return isInRole;
  }

  private getDirection() {
    console.log(this.reservation);
    const StartPoint: string = this.reservation.startingPoint;
    const StartPointArr = StartPoint.split(",");
    const EndingPoint: string = this.reservation.endingPoint;
    const EndingPointArr = EndingPoint.split(",");
    this.origin = {
      lat: Number(StartPointArr[0]),
      lng: Number(StartPointArr[1]),
    };
    this.destination = {
      lat: Number(EndingPointArr[0]),
      lng: Number(EndingPointArr[1]),
    };
  }

  AddOfferPrice()
  {
  
    this.intailOfferPrice();
    this.offerPrice.requestId=this._id;

    this.offerPriceService.clientComanyOfferNewOfferPrice(this.offerPrice)
    .subscribe((response) => {

      if(response)
      {
        message.Toast.fire(this.l('SavedSuccessfully'),);
        this.back();
      }
      else{
        message.Toast.fire(this.l('error'));
      }
    });
    
  
  }
  setvalue(e)
  {
   this.offerPrice.driverUserId=e.value.value
  }
}
