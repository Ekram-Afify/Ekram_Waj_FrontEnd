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
  AdminDriverDtoPagedResultDto,
  UserServiceProxy,
  AdminDriverServiceProxy,
  OfferPriceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { AppSessionService } from "@shared/session/app-session.service";
import { getCurrentLanguage } from "root.module";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent extends AppComponentBase implements OnInit {
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
  reservation: AdminCreateRequestDto = new AdminCreateRequestDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  PdfFile: File;
  drivers: SelectItem[] = [];
  states: SelectItem[] = [];
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
  reqId: string;
  origin: any;
  model: GetOfferPriceDto = new GetOfferPriceDto();
  destination: any;
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
      { label: this.l("Reservations") },
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

        this.maps.load().then(() => {
          this.zoom = 12;
          this.geoCoder = new google.maps.Geocoder();
        });
      });
    }
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
    debugger;
    // const isUserInAdminRole = this.isUserInRole("ADMIN");
    // const isUserInCustomerCompanyRole = this.isUserInRole("CLIENT");
    const filterQuery = "";

    this.driversServices
      .getAll(
        filterQuery,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
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
        debugger;
        const driverId = 0;

        this.model.requestId = this._id;
        this.offerPriceService
          .offerPriceByRequestId(this.model)
          .subscribe((res) => {
            debugger;
            const t = this.drivers.find((c) => c.value === res.driverId);
            this.drivers = [];
            this.drivers.push(t);
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

  back() {
    this._router.navigate(["/app/reservations"]);
  }

  pickupplaceMarker($event) {
    this.pickuplatitude = $event.coords.lat;
    this.pickuplongitude = $event.coords.lng;
    this.pickupgetAddress(this.pickuplatitude, this.pickuplongitude);
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
  }

  pickupsetCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.pickuplatitude = position.coords.latitude;
        this.pickuplongitude = position.coords.longitude;
        this.zoom = 8;
        this.pickupgetAddress(this.pickuplatitude, this.pickuplongitude);
      });
    }
  }

  setpickupAddress() {
    // this.firstFormGroup.get("pickupAddress").setValue(this.pickupAddress);
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
    this.destinationlatitude = $event.coords.lat;
    this.destinationlongitude = $event.coords.lng;
    this.destinationgetAddress(
      this.destinationlatitude,
      this.destinationlongitude
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
    }
  }
  destinationplaceMarker($event) {
    this.destinationlatitude = $event.coords.lat;
    this.destinationlongitude = $event.coords.lng;
    this.destinationgetAddress(
      this.destinationlatitude,
      this.destinationlongitude
    );
  }

  setdestinationAddress() {
    // this.destinationAddress= (this.destinationAddress);
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
}
