import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Injector,
  NgZone,
  ElementRef,
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
  AdminCategoryDto,
  AdminUpdateRquestDto,
  AdminRequestServiceProxy,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  TripRegVM,
  Trip,
  AdminDriverDtoPagedResultDto,
  OfferPriceServiceProxy,
  GetOfferPriceDto,
  AdminOfferPriceDto,
  AdminCreateRequestWithOfferDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { SaveEditableRow } from "primeng/table/table";
import { message } from "@shared/Message/message";
import { ActivatedRoute, Router } from "@angular/router";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { AppSessionService } from "@shared/session/app-session.service";
import {
  UserServiceProxy,
  AdminDriverServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { getCurrentLanguage } from "root.module";
import { state } from "@angular/animations";

@Component({
  selector: "app-update-reservation",
  templateUrl: "./update-reservation.component.html",
  styleUrls: ["./update-reservation.component.scss"],
})
export class UpdateReservationComponent
  extends AppComponentBase
  implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;
  @ViewChild("StartPointCtl", { static: false })
  public StartPointCtl: ElementRef;
  @ViewChild("endingPointCtrl", { static: false })
  public endingPointCtrl: ElementRef;
  firstFormSaving = false;

  _id: any;

  reservation: AdminUpdateRquestDto = new AdminUpdateRquestDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;

  destinationAddress;
  destinationlatitude: any;
  destinationlongitude: any;
  zoom: any = 12;
  geoCoder: any;
  statusSelected: any;

  pickupAddress: any;
  pickuplatitude: any;
  pickuplongitude: any;

  categories: SelectItem[] = [];
  states: SelectItem[] = [];
  drivers: SelectItem[] = [];

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
  userId: number;
  constructor(
    injector: Injector,
    private ngZone: NgZone,
    private _formBuilder: FormBuilder,
    private _reservationService: AdminRequestServiceProxy,
    private route: ActivatedRoute,
    private _router: Router,
    private maps: MapsAPILoader,
    private appSessionService: AppSessionService,
    private userService: UserServiceProxy,
    private driversServices: AdminDriverServiceProxy,
    private offerPriceService: OfferPriceServiceProxy,
    private _subcategoryService: AdminSubategoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l("Reservations") },
      { label: this.l("UpdateReservation") },
    ];

    this.initFirstFormGroup();

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
        debugger;
        this.reservation = result;
        this.destinationlatitude = this.reservation.startingPoint.split(",")[1];
        this.destinationlongitude = this.reservation.startingPoint.split(
          ","
        )[0];
        this.pickuplatitude = this.reservation.endingPoint.split(",")[1];
        this.pickuplongitude = this.reservation.endingPoint.split(",")[0];
        this.initCatss();
        this.initDrivers();
        this.initStates();
        this.patchFirstFormGroup();
        this.getDirection();
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
              this.getAddress(
                this.latitude,
                this.longitude,
                "stratingPointTitle"
              );
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
              this.getAddress(
                this.latitude,
                this.longitude,
                "endingPointTitle"
              );
            });
          });
        });
      });
    }
  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      arrivalDateTime: ["", [Validators.required, Validators.maxLength(512)]],
      paymentWay: ["", []],
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
      endingPointAdress: ["", [Validators.required, Validators.maxLength(512)]],
      endingPointTitle: ["", [Validators.required, Validators.maxLength(512)]],
      subcategoryId: ["", [Validators.required, Validators.maxLength(512)]],
      driverId: ["", Validators.required],
      deliveryCost: ["", [Validators.required, Validators.maxLength(5)]],
      status: ["", [Validators.required]],
    });
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
        this.firstFormGroup
          .get("subcategoryId")
          .setValue(
            this.categories.find(
              (c) => c.value === this.reservation.subcategoryId
            )
          );
      });
  }
  initDrivers() {
    // const isUserInAdminRole = this.isUserInRole("ADMIN");
    // const isUserInCustomerCompanyRole = this.isUserInRole("CLIENT");
    const filterQuery = "";
    // if (isUserInAdminRole) {
    // }
    this.driversServices
      .getAll(
        filterQuery,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        "",
        0,
        10000
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
        const model = new GetOfferPriceDto();
        model.requestId = this._id;
        this.offerPriceService.offerPriceByRequestId(model).subscribe((res) => {
          console.log(res);
          console.log("Driver");
          this.userId = res.userId;
          this.firstFormGroup
            .get("driverId")
            .setValue(this.drivers.find((c) => c.value === res.driverId));
        });
      });
  }
  initStates() {
    const result = [
      { id: null, value: this.l("Status") },
      { id: 1, value: this.l("Schedule") },
      { id: 3, value: this.l("Current") },
      { id: 4, value: this.l("Previous") },
      { id: 5, value: this.l("Cancelled") },
    ];
    this.states = [];
    result.forEach(function (status) {
      this.states.push({ label: status.value, value: status.id });
    }, this);
  }

  patchFirstFormGroup() {
    console.log(this.categories);
    this.firstFormGroup.patchValue({
      arrivalDateTime: this.reservation.arrivalDateTime.toDate(),
      paymentWay: this.reservation.paymentWay,
      notes: this.reservation.notes,
      startingPoint: this.reservation.startingPoint,
      endingPoint: this.reservation.endingPoint,
      stratingPointTitle: this.reservation.stratingPointTitle,
      endingPointTitle: this.reservation.endingPointTitle,
      deliveryCost: this.reservation.deliveryCost,
      status: this.states.find((c) => c.value === this.reservation.status),
    });
  }

  regTrip() {
    const trip: Trip = new Trip();
    trip.requestId = this._id;
    this._reservationService
      .regTrip(trip)
      .pipe(finalize(() => {}))
      .subscribe((res: string) => {
        message.Toast.fire(res);
      });
  }
  updateTrip() {
    const trip: Trip = new Trip();
    trip.requestId = this._id;
    this._reservationService
      .updateTrip(trip)
      .pipe(finalize(() => {}))
      .subscribe((res: boolean) => {
        if (res === true) {
          message.Toast.fire(this.l("SavedSuccessfully"));
        } else {
          message.Toast.fire(this.l("Faild"));
        }
      });
  }

  //   initJobRoles() {
  //     this._roleService
  //       .getAll("", 0, 10000)
  //       .pipe(
  //         finalize(() => {
  //         })
  //       )
  //       .subscribe((result: RoleDtoPagedResultDto) => {
  //         var JobRolesResult = result.items;

  //         this.JobRole = [];
  //         this.JobRole.push({ label: this.l('JobRole'), value: null });
  //         JobRolesResult.forEach(element => {
  //           this.JobRole.push({ label: element.displayName, value: element.id });
  //         });
  //       });

  //   }

  //   initGovernorates() {
  //     this._governorateService
  //       .getAllForDropDownList()
  //       .pipe(
  //         finalize(() => {
  //         })
  //       )
  //       .subscribe((result: GetDepartmentDropDownListDto[]) => {
  //         var GovernoratesResult = result;

  //         this.Governorate = [];
  //         this.Governorate.push({ label: this.l('Governorate'), value: null });
  //         GovernoratesResult.forEach(element => {
  //           this.Governorate.push({ label: element.name, value: element.id });
  //         });
  //       });

  //   }
  //   initBranches() {
  //     this._branchService
  //       .getAllForDropDownList()
  //       .pipe(
  //         finalize(() => {
  //         })
  //       )
  //       .subscribe((result: GetDepartmentDropDownListDto[]) => {
  //         var BranchsResult = result;

  //         this.theBranch = [];
  //         this.theBranch.push({ label: this.l('Branche'), value: null });
  //         BranchsResult.forEach(element => {
  //           this.theBranch.push({ label: element.name, value: element.id });
  //         });
  //       });

  //   }
  //   initDepartments() {
  //     this._departmentService
  //       .getAllForDropDownList()
  //       .pipe(
  //         finalize(() => {
  //         })
  //       )
  //       .subscribe((result: GetDepartmentDropDownListDto[]) => {
  //         var depatmrntResult = result;

  //         this.HisDepartment = [];
  //         this.HisDepartment.push({ label: this.l('Department'), value: null });
  //         depatmrntResult.forEach(element => {
  //           this.HisDepartment.push({ label: element.name, value: element.id });
  //         });
  //       });

  //   }

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
    model.adminCreateRequestDto.id = this._id;
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
    model.adminOfferPriceDto = adminOfferPriceDto;
    this._reservationService
      .updaterequestFromAdminPanel(model)
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        // this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  private getCurrentGeoLocation(): void {
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

  private getDirection() {
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
}
