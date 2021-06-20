import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Injector,
  ElementRef,
  InjectionToken,
} from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CompanyDto,
  AdminRequestServiceProxy,
  AdminDriverServiceProxy,
  AdminCreateRequestDto,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  AdminOfferPriceDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { message } from "@shared/Message/message";
import { ActivatedRoute, Router } from "@angular/router";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import {
  AdminDriverDtoPagedResultDto,
  UserServiceProxy,
  AdminCreateRequestWithOfferDto,
} from "../../../../../shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { getCurrentLanguage } from "root.module";
import { NgZone } from "@angular/core";
import { AgmDirectionModule } from "agm-direction/src/agm-direction";

export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");

@Component({
  selector: "app-create-reservation",
  templateUrl: "./create-reservation.component.html",
  styleUrls: ["./create-reservation.component.scss"],
})
export class CreateReservationComponent
  extends AppComponentBase
  implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;
  @ViewChild("StartPointCtl", { static: false })
  public StartPointCtl: ElementRef;
  @ViewChild("endingPointCtrl", { static: false })
  public endingPointCtrl: ElementRef;

  firstFormSaving = false;

  destinationAddress;
  destinationlatitude: any;
  destinationlongitude: any;
  zoom: any = 12;
  geoCoder: any;

  pickupAddress: any;
  pickuplatitude: any;
  pickuplongitude: any;

  reservation: AdminCreateRequestDto = new AdminCreateRequestDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;
  categories: SelectItem[] = [];
  drivers: SelectItem[] = [];
  states: SelectItem[] = [];

  JobRole: SelectItem[] = [];

  basicFormGroupSupportingfiles: FormGroup;
  userImageSrc: any = "";
  uploadedFiles: any[] = [];
  currentFiles: any[] = [];
  DataAdditionalfile: any = {};
  UploadImage: any;
  objectAdditionalAttachments: any = {};
  researchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalDescriptions: any[] = [];
  latitude: number;
  longitude: number;
  origin: any = "24.723456,46.7009536";
  destination: any = "24.6923952,46.6660188";
  req: any = { VAT: 15 };

  constructor(
    injector: Injector,
    private ngZone: NgZone,
    private _formBuilder: FormBuilder,
    private _reservationService: AdminRequestServiceProxy,
    private route: ActivatedRoute,
    private _router: Router,
    private _subcategoryService: AdminSubategoryServiceProxy,
    private driversServices: AdminDriverServiceProxy,
    private appSessionService: AppSessionService,
    private userService: UserServiceProxy,
    private maps: MapsAPILoader
  ) {
    super(injector);
  }

  ngOnInit() {
    this.maps.load().then(() => {
      this.setCurrentLocation();
      this.zoom = 12;
      this.geoCoder = new google.maps.Geocoder();
      const SPautocomplete = new google.maps.places.Autocomplete(
        this.StartPointCtl.nativeElement
      );
      SPautocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = SPautocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.firstFormGroup
            .get("startingPoint")
            .setValue(this.latitude + "," + this.longitude);
          this.getAddress(this.latitude, this.longitude, "stratingPointTitle");
        });
      });
      const EPautocomplete = new google.maps.places.Autocomplete(
        this.endingPointCtrl.nativeElement
      );
      EPautocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = EPautocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.firstFormGroup
            .get("endingPoint")
            .setValue(this.latitude + "," + this.longitude);
          this.getAddress(this.latitude, this.longitude, "endingPointTitle");
        });
      });
    });
    this.items = [
      { label: this.l("Reservations") },
      { label: this.l("AddReservation") },
    ];
    this.initFirstFormGroup();
    this.initCatss();
    this.initDrivers();
    this.initStates();
    // this.initJobRoles();
    // this.destinationAddress = 47.02797716992487;
    // this.destinationlongitude = 24.353011851932827;
    // this.pickupAddress = 47.02797716992487;
    // this.pickuplongitude = 24.353011851932827;

    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ["", Validators.required],
      FileDescription: [""],
    });
  }

  deliveryCostChanged() {
    debugger;
    this.req.vatAmount = (this.req.VAT * this.req.deliveryCost) / 100;
    this.req.net =
      parseFloat(this.req.vatAmount || 0) +
      parseFloat(this.req.deliveryCost || 0);
  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      arrivalDateTime: ["", [Validators.required, Validators.maxLength(512)]],
      paymentWay: ["", []],
      receiverMobile:["", [Validators.required, Validators.maxLength(512)]],
      notes: ["", [Validators.required, Validators.maxLength(512)]],
      startingPoint: ["", [Validators.required, Validators.maxLength(512)]],
      endingPoint: ["", [Validators.required, Validators.maxLength(512)]],
      stratingPointAdress: [
        "",
        [Validators.required, Validators.maxLength(512)],
      ],
      stratingPointTitle: [
        "",
        [Validators.required, Validators.maxLength(512)],
      ],
      endingPointTitle: ["", [Validators.required, Validators.maxLength(512)]],
      endingPointAdress: ["", [Validators.required, Validators.maxLength(512)]],
      subcategoryId: ["", [Validators.required, Validators.maxLength(512)]],
      driverId: ["", Validators.required],
      deliveryCost: ["", [Validators.required, Validators.maxLength(5)]],
      status: ["", [Validators.required]],
    });
  }

  initStates() {
    this.states.push({ label: this.l("Status"), value: null });
    this.states.push({ label: this.l("Schedule"), value: 1 });
    this.states.push({ label: this.l("Current"), value: 3 });
    this.states.push({ label: this.l("Previous"), value: 4 });
    this.states.push({ label: this.l("Cancelled"), value: 5 });
  }
  initCatss() {
    this._subcategoryService
      .getAll("", undefined, "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.categories = [];
        this.categories.push({ label: this.l("Category"), value: null });
        ReqResult.forEach((element) => {
          const itemname =
            getCurrentLanguage() === "en" ? element.name : element.nameAr;
          this.categories.push({ label: itemname, value: element.id });
        });
      });
  }

  initDrivers(): void {
    // const isUserInAdminRole = this.isUserInRole("ADMIN");
    // const isUserInCustomerCompanyRole = this.isUserInRole("CLIENT");
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
        
        false,
        "",
        0,
       10000,
      )
      .pipe(finalize(() => {}))
      .subscribe((result: AdminDriverDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.drivers = [];
        this.drivers.push({ label: this.l("Drivers"), value: null });
        ReqResult.forEach((element) => {
          this.drivers.push({ label: element.fullName, value: element.id });
        });
      });
  }

  clearInput(name) {
    this.firstFormGroup.get(name).setValue("");
  }
  onFilePDFSelect(files: any) {
    this.PdfFile = files.files[0];
  }
  clearFile(fileUpload) {
    this.PdfFile = null;
    fileUpload.clear();
  }

  ImagePreview(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert(this.l("OnlyImagesAreSupported"));
      return;
    }

    const reader = new FileReader();
    this.UploadImage = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.userImageSrc = reader.result;
    };
  }
  uploadFileVehicle() {
    $(".upload-image-register-dealer").click();
  }
  RemoveuploadFileRegisterDealer() {
    this.userImageSrc = "";
  }

  UploadAnotherFile() {
    $(
      ".form-field-multi-fileUpload p-fileupload .ui-fileupload .ui-fileupload-buttonbar .ui-fileupload-choose input"
    ).click();
  }
  removeFile(file: any) {
    const index: number = this.researchAdditionalAttachments.indexOf(file);
    if (index !== -1) {
      this.researchAdditionalAttachments.splice(index, 1);
      this.FinalResearchAdditionalAttachments.splice(index, 1);
      this.FinalResearchAdditionalDescriptions.splice(index, 1);
    }
  }
  onAdditionalFileSelect(files: any) {
    this.DataAdditionalfile = files.files[0];
    this.basicFormGroupSupportingfiles
      .get("controlNameAdditionalFile")
      .setValue(files.files[0].name);
  }
  removeFileAdditionalFile(file: any, AdditionalFile) {
    AdditionalFile.value = "";
    this.basicFormGroupSupportingfiles
      .get("controlNameAdditionalFile")
      .setValue("");
  }
  fieldTextarea(name) {
    this.basicFormGroupSupportingfiles.get("FileDescription").setValue("");
  }
  AddSupportingfiles() {
    const objectTypeURL = new Object(this.DataAdditionalfile) as any;
    let objectURL = "";
    if (objectTypeURL.type === "application/pdf") {
      objectURL = "pdf";
    } else if (
      objectTypeURL.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      objectURL = "wordprocessingml";
    } else if (
      objectTypeURL.type === "image/png" ||
      objectTypeURL.type === "image/jpeg"
    ) {
      objectURL = "image";
    } else {
      objectURL = "wordprocessingml";
    }
    if (this.basicFormGroupSupportingfiles.valid) {
      this.objectAdditionalAttachments = {
        name: this.DataAdditionalfile.name,
        lastModified: this.DataAdditionalfile.lastModified,
        lastModifiedDate: this.DataAdditionalfile.lastModifiedDate,
        webkitRelativePath: this.DataAdditionalfile.webkitRelativePath,
        size: this.DataAdditionalfile.size,
        type: this.DataAdditionalfile.type,
        objectURL: {
          changingThisBreaksApplicationSecurity:
            objectURL === "image"
              ? this.DataAdditionalfile.objectURL
                  .changingThisBreaksApplicationSecurity
              : objectURL,
        },
        FileDescription: this.basicFormGroupSupportingfiles.get(
          "FileDescription"
        ).value,
      };
      this.researchAdditionalAttachments.push(this.objectAdditionalAttachments);
      this.FinalResearchAdditionalAttachments.push(this.DataAdditionalfile);
      this.FinalResearchAdditionalDescriptions.push(
        this.objectAdditionalAttachments.FileDescription
      );

      this.Supportingfiles.hide();
      this.basicFormGroupSupportingfiles.reset();
    } else {
      this.Supportingfiles.hide();
      this.basicFormGroupSupportingfiles.reset();
    }
  }

  pickupplaceMarker($event) {
    this.pickuplatitude = $event.coords.lat;
    this.pickuplongitude = $event.coords.lng;
    this.pickupgetAddress(this.pickuplatitude, this.pickuplongitude);
    this.firstFormGroup
      .get("endingPoint")
      .setValue(this.pickuplatitude + "," + this.pickuplongitude);
  }

  pickupgetAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.pickupAddress = results[0].formatted_address;
          } else {
            window.alert("No results found");
          }
        } else {
        }
      }
    );
  }

  pickupmarkerDragEnd($event: MouseEvent) {
    this.pickuplatitude = $event.coords.lat;
    this.pickuplongitude = $event.coords.lng;
    this.pickupgetAddress(this.pickuplatitude, this.pickuplongitude);
    this.firstFormGroup
      .get("endingPoint")
      .setValue(this.pickuplatitude + "," + this.pickuplongitude);
    this.getAddress(
      this.pickuplatitude,
      this.pickuplongitude,
      "endingPointTitle"
    );
    this.getAddress(
      this.pickuplatitude,
      this.pickuplongitude,
      "endingPointAdress"
    );
  }

  pickupsetCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.pickuplatitude = position.coords.latitude;
        this.pickuplongitude = position.coords.longitude;
        this.zoom = 8;
        this.pickupgetAddress(this.pickuplatitude, this.pickuplongitude);
      });
      this.firstFormGroup
        .get("endingPoint")
        .setValue(this.pickuplatitude + "," + this.pickuplongitude);
    }
  }

  setpickupAddress() {
    this.firstFormGroup.get("pickupAddress").setValue(this.pickupAddress);
  }

  onFirstFromSubmit() {
    this.firstFormSaving = true;
    if (this.firstFormGroup.valid) {
      this.reservation.arrivalDateTime = this.firstFormGroup.value.arrivalDateTime;
      this.reservation.paymentWay = 1;
      this.reservation.receiverMobile=this.firstFormGroup.value.receiverMobile
      this.reservation.notes = this.firstFormGroup.value.notes;
      this.reservation.startingPoint = this.firstFormGroup.get(
        "startingPoint"
      ).value;
      this.reservation.endingPoint = this.firstFormGroup.get(
        "endingPoint"
      ).value;
      this.reservation.stratingPointAdress = this.firstFormGroup.get(
        "stratingPointTitle"
      ).value;
      this.reservation.stratingPointTitle = this.firstFormGroup.get(
        "stratingPointTitle"
      ).value;
      this.reservation.endingPointTitle = this.firstFormGroup.get(
        "endingPointTitle"
      ).value;
      this.reservation.endingPointAdress = this.firstFormGroup.get(
        "endingPointTitle"
      ).value;
      this.reservation.subcategoryId = this.firstFormGroup.value.subcategoryId.value;
      this.reservation.deliveryCost = this.firstFormGroup.get(
        "deliveryCost"
      ).value;
      this.reservation.status = this.firstFormGroup.get("status").value.value;
      this.save();
    }
  }

  save() {
    debugger;
    const model = new AdminCreateRequestWithOfferDto();
    model.adminCreateRequestDto = this.reservation;
    debugger;
    const adminOfferPriceDto = new AdminOfferPriceDto();
    adminOfferPriceDto.driverId = this.firstFormGroup.get(
      "driverId"
    ).value.value;
    adminOfferPriceDto.driverName = this.firstFormGroup.get(
      "driverId"
    ).value.label;
    adminOfferPriceDto.deliveryCost = this.firstFormGroup.get(
      "deliveryCost"
    ).value;
    adminOfferPriceDto.offerStatus = 3;
    adminOfferPriceDto.vat = this.req.VAT;
    model.adminOfferPriceDto = adminOfferPriceDto;
    this._reservationService
      .createRequestFromAdminPanel(model)
      .pipe(finalize(() => {}))
      .subscribe(() => {
        message.Toast.fire(this.l("SavedSuccessfully"));
        this.cancel();
      });
  }

  cancel() {
    this._router.navigate(["/app/reservations"]);
  }

  destinationgetAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.destinationAddress = results[0].formatted_address;
          } else {
            window.alert("No results found");
          }
        } else {
        }
      }
    );
  }

  destinationmarkerDragEnd($event: MouseEvent) {
    debugger;
    this.destinationlatitude = $event.coords.lat;
    this.destinationlongitude = $event.coords.lng;
    this.destinationgetAddress(
      this.destinationlatitude,
      this.destinationlongitude
    );
    this.firstFormGroup
      .get("startingPoint")
      .setValue(this.destinationlatitude + "," + this.destinationlongitude);
    this.getAddress(
      this.destinationlatitude,
      this.destinationlongitude,
      "stratingPointTitle"
    );
    this.getAddress(
      this.destinationlatitude,
      this.destinationlongitude,
      "stratingPointAdress"
    );
  }

  destinationsetCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.destinationlatitude = position.coords.latitude;
        this.destinationlongitude = position.coords.longitude;
        this.zoom = 8;
        this.destinationgetAddress(
          this.destinationlatitude,
          this.destinationlongitude
        );
      });
      this.firstFormGroup
        .get("startingPoint")
        .setValue(this.destinationlatitude + "," + this.destinationlongitude);
    }
  }
  destinationplaceMarker($event) {
    this.destinationlatitude = $event.coords.lat;
    this.destinationlongitude = $event.coords.lng;
    this.destinationgetAddress(
      this.destinationlatitude,
      this.destinationlongitude
    );
    this.firstFormGroup
      .get("startingPoint")
      .setValue(this.destinationlatitude + "," + this.destinationlongitude);
  }

  setdestinationAddress() {
    this.destinationAddress = this.destinationAddress;
  }

  // Mohammed Elgohary
  isUserInRole(roleName: string): boolean {
    let isInRole = false;
    this.userService
      .getUserRoles(this.appSessionService.user.id, roleName)
      .subscribe((response) => (isInRole = response));
    return isInRole;
  }

  getAddress(latitude, longitude, ctrlName) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.pickupAddress = results[0].formatted_address;
            this.firstFormGroup
              .get(ctrlName)
              .setValue(results[0].formatted_address);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  // Get Current Location Coordinates
  private setCurrentLocation(): void {
    // if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.zoom = 8;
    });
    // }
  }

  private setPointAdressToCurrent(is_start: Boolean): void {
    // if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      if (is_start) {
        this.firstFormGroup
          .get("startingPoint")
          .setValue(position.coords.latitude + "," + position.coords.longitude);
        this.getAddress(
          position.coords.latitude,
          position.coords.longitude,
          "stratingPointTitle"
        );
        this.getAddress(
          position.coords.latitude,
          position.coords.longitude,
          "stratingPointAdress"
        );
      } else {
        this.firstFormGroup
          .get("endingPoint")
          .setValue(position.coords.latitude + "," + position.coords.longitude);
        this.getAddress(
          position.coords.latitude,
          position.coords.longitude,
          "endingPointTitle"
        );
        this.getAddress(
          position.coords.latitude,
          position.coords.longitude,
          "endingPointAdress"
        );
      }
    });
    // }
  }

  private getCurrentGeoLocation(): void {
    // if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.destinationlatitude = position.coords.latitude;
      this.destinationlongitude = position.coords.longitude;
      this.zoom = 8;
      this.destinationgetAddress(
        this.destinationlatitude,
        this.destinationlongitude
      );
    });
    this.firstFormGroup
      .get("startingPoint")
      .setValue(this.destinationlatitude + "," + this.destinationlongitude);
    // }
  }

  private getDirection() {
    debugger;
    const StartPoint: string = this.firstFormGroup.get("startingPoint").value;
    const StartPointArr = StartPoint.split(",");
    const EndingPoint: string = this.firstFormGroup.get("endingPoint").value;
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

  public markerOptions = {
    origin: {
      icon: "./assets/images/map-pin.png",
      draggable: true,
    },
    destination: {
      icon: "./assets/images/map-pin1.png",
      // label: 'MARKER LABEL',
      // opacity: 0.8,
      draggable: true,
    },
  };

  public renderOptions = {
    suppressMarkers: true,
  };

  getcoords(type, event) {
    if (type == "origin") {
      this.firstFormGroup
        .get("startingPoint")
        .setValue(event.lat() + "," + event.lng());
      this.getAddress(event.lat(), event.lng(), "stratingPointTitle");
      this.getAddress(event.lat(), event.lng(), "stratingPointAdress");
    } else {
      this.firstFormGroup
        .get("endingPoint")
        .setValue(event.lat() + "," + event.lng());
      this.getAddress(event.lat(), event.lng(), "endingPointTitle");
      this.getAddress(event.lat(), event.lng(), "endingPointAdress");
    }
  }
}
