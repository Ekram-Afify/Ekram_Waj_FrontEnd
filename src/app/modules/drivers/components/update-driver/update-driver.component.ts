import {
  AdminDriverDto,
  AdminDriverServiceProxy,
  AdminUpdateDriverDto,
  AdminSubategoryServiceProxy,
  AdminSubcategoryDtoPagedResultDto,
  AdminCategoryServiceProxy,
  CompanyServiceProxy,
  CompanyDtoPagedResultDto,
  PlateTypesServiceProxy,
  PlateTypeDtoPagedResultDto,
} from "./../../../../../shared/service-proxies/service-proxies";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Injector,
  ElementRef,
  NgZone,
} from "@angular/core";
import { MenuItem, SelectItem } from "primeng/api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { AppComponentBase } from "@shared/app-component-base";

import { finalize } from "rxjs/operators";
import { SaveEditableRow } from "primeng/table/table";
import { ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { message } from "@shared/Message/message";
import { getRemoteServiceBaseUrl } from "root.module";
import { getCurrentLanguage } from "root.module";
import { MapsAPILoader, MouseEvent } from "@agm/core";
// import { AdminCategoryServiceProxy } from '../../../../../shared/service-proxies/service-proxies';
// import { ElementRef } from '@angular/core';

@Component({
  selector: "app-update-driver",
  templateUrl: "./update-driver.component.html",
  styleUrls: ["./update-driver.component.scss"],
})
export class UpdateDriverComponent extends AppComponentBase implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;
  @ViewChild("search", { static: false })
  public searchElementRef: ElementRef;
  //agm map
  latitude: number;
  longitude: number;
  zoom: number;
  platetypes: SelectItem[] = [];
  address: string;
  private geoCoder;
  subCats = [];
  firstFormSaving = false;
  forthFormSaving = false;
  driver: any = {};
  _id: any;
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;

  categories: SelectItem[] = [];
  companies: SelectItem[] = [];
  Hijri: any;

  Governorate: SelectItem[] = [];

  basicFormGroupSupportingfiles: FormGroup;
  // userImageSrc: any = "";
  userImageSrc1: any = "";
  userImageSrc2: any = "";
  userImageSrc3: any = "";
  userImageSrc4: any = "";
  userImageSrc5: any = "";
  userImageSrc6: any = "";
  uploadedFiles: any[] = [];
  currentFiles: any[] = [];
  selectedCategory;
  forthFormGroup: FormGroup;
  DataAdditionalfile: any = {};
  UploadImage: any;
  objectAdditionalAttachments: any = {};
  researchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalDescriptions: any[] = [];
  disable = false;
  constructor(
    injector: Injector,
    private _formBuilder: FormBuilder,
    private _personnelService: AdminDriverServiceProxy,
    private _companyService: CompanyServiceProxy,
    private _SubcategoryService: AdminSubategoryServiceProxy,
    private _categoryService: AdminCategoryServiceProxy,
    private mapsAPILoader: MapsAPILoader,
    private _platetypesService: PlateTypesServiceProxy,
    private ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    super(injector);
    this._platetypesService
      .getAll("", "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: PlateTypeDtoPagedResultDto) => {
        const Result = result.items;

        this.platetypes = [];
        this.platetypes.push({ label: this.l("PlateType"), value: null });
        Result.forEach((element) => {
          const itemname =
            getCurrentLanguage() === "en" ? element.name : element.nameAr;
          this.platetypes.push({ label: itemname, value: element.id });
        });
      });
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this._id = params["id"];
      }
      if (params["idd"]) {
        this._id = params["idd"];
        this.disable = true;
      }
      // console.log("_id : ", this._id);
      this._personnelService.get(this._id).subscribe((result) => {
        this.driver = result;
        console.log("driver : ", this.driver);
        this.changeVechileCategory(null);
        this.userImageSrc1 =
          getRemoteServiceBaseUrl() + "/" + this.driver.profilePicture;
        this.userImageSrc2 =
          getRemoteServiceBaseUrl() + "/" + this.driver.identityPicture;
        this.userImageSrc3 =
          getRemoteServiceBaseUrl() + "/" + this.driver.frontVehiclePicture;
        this.userImageSrc4 =
          getRemoteServiceBaseUrl() + "/" + this.driver.backVehiclePicture;
        this.userImageSrc5 =
          getRemoteServiceBaseUrl() + "/" + this.driver.lisencePicture;
        this.userImageSrc6 =
          getRemoteServiceBaseUrl() + "/" + this.driver.vehicleLisencePicture;
      });
    });
  }

  ngOnInit() {
    this.Hijri = {
      firstDayOfWeek: 0,
      monthNames: "محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأول_جمادى الآخر_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة".split(
        "_"
      ),
      monthNamesShort: "محرم_صفر_ربيع1_ربيع2_جمادى1_جمادى2_رجب_شعبان_رمضان_شوال_القعدة_الحجة".split(
        "_"
      ),
      dayNames: [
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
      ],
      dayNamesShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
      dayNamesMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
      today: "اليوم",
      clear: "Clear",
      dateFormat: "mm/dd/yy",
      weekHeader: "Wk",
      firstDay: 1,
      isRTL: true,
    };
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

    this.items = [
      { label: this.l("Drivers") },
      { label: this.l("EditeDriver") },
    ];

    this.initFirstFormGroup();
    this.initCatss();
    this.initCompanies();

    this.initForthFormGroup();

    // this.initGovernorates();

    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ["", Validators.required],
      FileDescription: [""],
    });
  }//END ngOnInt()



  getSubs(categoryId) {
    this._SubcategoryService
      .getAll("", categoryId, undefined, 0, 100)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
        const ReqResult = result.items;
        // this.subCats = [];
        // console.log("ReqResult : ", ReqResult);

        // this.subCats.push({ label: this.l("vechileType"), value: null });
        ReqResult.forEach((element) => {
          const itemname =
            getCurrentLanguage() === "en" ? element.name : element.nameAr;
          // this.subCats.push({ label: itemname, value: element.id });
          this.subCats = [
            ...this.subCats,
            { label: itemname, value: element.id },
          ];
        });
        this.patchFirstFormGroup();
        // console.log("subCats : ", this.subCats);
      });
  }
  changeVechileCategory(e) {
    this.subCats = [];
    if (e != null) {
      this._SubcategoryService
        .getAll("", e.value.value, undefined, 0, 100)
        .pipe(finalize(() => {}))
        .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
          const ReqResult = result.items;
          // this.subCats = [];
          // console.log("ReqResult : ", ReqResult);

          // this.subCats.push({ label: this.l("vechileType"), value: null });
          ReqResult.forEach((element) => {
            const itemname =
              getCurrentLanguage() === "en" ? element.name : element.nameAr;
            // this.subCats.push({ label: itemname, value: element.id });
            this.subCats = [
              ...this.subCats,
              { label: itemname, value: element.id },
            ];
          });
          this.firstFormGroup.controls.vehicleType.setValue(
            this.subCats[0].value
          );
          // console.log("subCats : ", this.subCats);
        });
    } else {
      // console.log("test 0");

      this._SubcategoryService
        .getAll("", undefined, undefined, 0, 100)
        .pipe(finalize(() => {}))
        .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
          const ReqResult = result.items;
          // this.subCats = [];
          // console.log("ReqResult : ", ReqResult);

          for (let i = 0; i < ReqResult.length; i++) {
            if (ReqResult[i].id == this.driver.vehicleType) {
              this.selectedCategory = ReqResult[i].categoryId;
              console.log("selectedCategory : ", this.selectedCategory);
              this.getSubs(this.selectedCategory);
            }
          }
          // console.log("ReqResult : ", ReqResult);

          // this.subCats.push({ label: this.l("vechileType"), value: null });
          ReqResult.forEach((element) => {
            const itemname =
              getCurrentLanguage() === "en" ? element.name : element.nameAr;
            // this.subCats.push({ label: itemname, value: element.id });
            this.subCats = [
              ...this.subCats,
              { label: itemname, value: element.id },
            ];
          });

          // console.log("subCats : ", this.subCats);
        });
    }
    // console.log("e : ", e.value);
  }
  initCatss() {
    this._categoryService
      .getAll("", undefined, 0, 100)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.categories = [];
        this.categories.push({ label: this.l("vechileType"), value: null });
        ReqResult.forEach((element) => {
          this.categories.push({
            label:
              getCurrentLanguage() === "en" ? element.name : element.nameAr,
            value: element.id,
          });
        });
      });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        console.log(results);
        console.log(status);
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
            if (this.firstFormGroup.controls.AddressTitle)
              this.firstFormGroup.controls.AddressTitle.setValue(this.address);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  initCompanies() {
    this._companyService
      .getAll("", "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.companies = [];
        this.companies.push({ label: this.l("Company"), value: null });
        ReqResult.forEach((element) => {
          this.companies.push({
            label:
              getCurrentLanguage() === "en" ? element.name : element.nameAr,
            value: element.id,
          });
        });
      });
  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      isDriverAvilable: ["", []],
      offDuty: [""],
      isWaselDriver: [""],
      isWaselVehicle: [""],
      isReceiveOrder:[""],
      phone: ["", [Validators.required, Validators.maxLength(512)]],
      email: ["", [Validators.required, Validators.maxLength(512)]],
      fullName: ["", [Validators.required, Validators.maxLength(512)]],
      makePriceOffer: [false,[]],
      bankAccount: ["", [ Validators.maxLength(512)]],
      plate: ["", [Validators.required, Validators.maxLength(512)]],
      plateType: ["", [Validators.required, Validators.maxLength(512)]],
      walletValue: [""],
      AddressTitle: [
        this.address,
        [Validators.required, Validators.maxLength(512)],
      ],
      dateOfBirthGregorian: [
        "",
        [Validators.required, Validators.maxLength(512)],
      ],
      dateOfBirthHijri: ["", [Validators.required, Validators.maxLength(512)]],
      vehicleSequenceNumber: [
        "",
        [Validators.required, Validators.maxLength(512)],
      ],
      driverIdentityNumber: [
        "",
        [Validators.required, Validators.maxLength(512)],
      ],
      vehicleCategory: ["", [Validators.required, Validators.maxLength(512)]],
      vehicleType: [""],
      type: ["", []],
      company: ["", [Validators.required, Validators.maxLength(512)]],
    });
    if (this.disable) {
      this.firstFormGroup.controls["isDriverAvilable"].disable();
      this.firstFormGroup.controls["makePriceOffer"].disable();
      this.firstFormGroup.controls["isReceiveOrder"].disable();
      this.firstFormGroup.controls["isWaselVehicle"].disable();
      this.firstFormGroup.controls["plateType"].disable();
      this.firstFormGroup.controls["offDuty"].disable();
      this.firstFormGroup.controls["isWaselDriver"].disable();
      this.firstFormGroup.controls["phone"].disable();
      this.firstFormGroup.controls["email"].disable();
      this.firstFormGroup.controls["walletValue"].disable();
      this.firstFormGroup.controls["fullName"].disable();
      this.firstFormGroup.controls["bankAccount"].disable();
      this.firstFormGroup.controls["plate"].disable();
      this.firstFormGroup.controls["AddressTitle"].disable();
      this.firstFormGroup.controls["vehicleSequenceNumber"].disable();
      this.firstFormGroup.controls["driverIdentityNumber"].disable();
      this.firstFormGroup.controls["vehicleType"].disable();
    }
  }

  initForthFormGroup() {
    this.forthFormGroup = this._formBuilder.group({});
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

  ImagePreview(files, imgnum) {
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
      switch (imgnum) {
        case 1:
          this.userImageSrc1 = reader.result;
          break;

        case 2:
          this.userImageSrc2 = reader.result;
          break;
        case 3:
          this.userImageSrc3 = reader.result;
          break;
        case 4:
          this.userImageSrc4 = reader.result;
          break;
        case 5:
          this.userImageSrc5 = reader.result;
          break;
        case 6:
          this.userImageSrc6 = reader.result;
          break;
        default:
          break;
      }
    };
  }
  uploadFileVehicle(imgnum) {
    switch (imgnum) {
      case 1:
        $(".upload-image-register-dealer1").click();
        break;

      case 2:
        $(".upload-image-register-dealer2").click();
        break;
      case 3:
        $(".upload-image-register-dealer3").click();
        break;
      case 4:
        $(".upload-image-register-dealer4").click();
        break;
      case 5:
        $(".upload-image-register-dealer5").click();
        break;
      case 6:
        $(".upload-image-register-dealer6").click();
        break;
      default:
        break;
    }
  }
  RemoveuploadFileRegisterDealer(imgnum) {
    switch (imgnum) {
      case 1:
        this.userImageSrc1 = "";
        break;

      case 2:
        this.userImageSrc2 = "";
        break;
      case 3:
        this.userImageSrc3 = "";
        break;
      case 4:
        this.userImageSrc4 = "";
        break;
      case 5:
        this.userImageSrc5 = "";
        break;
      case 6:
        this.userImageSrc6 = "";
        break;
      default:
        break;
    }
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

  patchFirstFormGroup() {
    // console.log(this.categories.find(c => c.value === this.driver.vehicleType));
    // console.log(this.companies.find(c => c.value === this.driver.companyId));
    // console.log(this.driver.vehicleType);
    // console.log(this.driver.companyId);
    // this.firstFormGroup.patchValue({
    //   isDriverAvilable: this.driver.isDriverAvilable,
    //   offDuty: !this.driver.offDuty,
    //   phone: this.driver.phone,
    //   fullName: this.driver.fullName,
    //   email: this.driver.email,
    // vehicleType: this.categories.find(
    //   (c) => c.value === this.driver.vehicleType
    // ),
    //   company: this.companies.find((c) => c.value === this.driver.companyId),
    //   vehicleSequenceNumber: this.driver.vehicleSequenceNumber,
    //   driverIdentityNumber: this.driver.driverIdentityNumber,
    // });
    // console.log("driver : ", this.driver);

    // console.log(
    //   "selected sub cat : ",
    //   this.subCats.find((c) => c.value === this.driver.vehicleType)
    // );

    // console.log(
    //   "selected cat : ",
    //   this.categories.find((c) => c.value === this.selectedCategory)
    // );
    this.latitude = this.driver.lat;
    this.longitude = this.driver.long;

    this.firstFormGroup = this._formBuilder.group({
      isWaselDriver: [this.driver.isWaselDriver],
      makePriceOffer: [this.driver.makePriceOffer],
      isReceiveOrder:[this.driver.isReceiveOrder],
      bankAccount: [this.driver.bankAccount],
      isWaselVehicle: [this.driver.isWaselVehicle],
      isDriverAvilable: [this.driver.isDriverAvilable, []],
      offDuty: [!this.driver.offDuty],
      phone: [
        this.driver.phone,
        [Validators.required, Validators.maxLength(512)],
      ],
      email: [
        this.driver.email,
        [Validators.required, Validators.maxLength(512)],
      ],
      fullName: [
        this.driver.fullName,
        [Validators.required, Validators.maxLength(512)],
      ],
      plate: [
        this.driver.plate,
        [Validators.required, Validators.maxLength(512)],
      ],
      plateType: [
        this.platetypes.find((c) => c.value === this.driver.plateTypeId),
        [Validators.required, Validators.maxLength(512)],
      ],
      walletValue: [
        this.driver.walletValue

      ],
      AddressTitle: [
        this.driver.addressTitle,
        [Validators.required, Validators.maxLength(512)],
      ],
      dateOfBirthGregorian: [
        this.driver.dateOfBirthGregorian.toDate(),
        [Validators.required, Validators.maxLength(512)],
      ],
      dateOfBirthHijri: [
        new Date(this.driver.dateOfBirthHijri),
        [Validators.required, Validators.maxLength(512)],
      ],
      vehicleSequenceNumber: [
        this.driver.vehicleSequenceNumber,
        [Validators.required, Validators.maxLength(512)],
      ],
      driverIdentityNumber: [
        this.driver.driverIdentityNumber,
        [Validators.required, Validators.maxLength(512)],
      ],
      vehicleCategory: [
        this.categories.find((c) => c.value === this.selectedCategory),
        [Validators.required, Validators.maxLength(512)],
      ],
      vehicleType: [
        this.subCats.find((c) => c.value === this.driver.vehicleType),
      ],
      type: [""],
      company: [
        this.companies.find((c) => c.value === this.driver.companyId),
        [Validators.required, Validators.maxLength(512)],
      ],
    });
  }

  onFirstFromSubmit() {
    this.firstFormSaving = true;
    if (this.firstFormGroup.valid) {
      if (this.firstFormGroup.value.isDriverAvilable === "") {
        this.driver.isDriverAvilable = false;
      } else {
        this.driver.isDriverAvilable = this.firstFormGroup.value.isDriverAvilable;
      }

      this.driver.id = this._id;
      this.driver.phone = this.firstFormGroup.value.phone;
      this.driver.isWaselDriver = this.firstFormGroup.value.isWaselDriver;
      this.driver.isWaselVehicle = this.firstFormGroup.value.isWaselVehicle;
      this.driver.isReceiveOrder = this.firstFormGroup.value.isReceiveOrder;
      this.driver.fullName = this.firstFormGroup.value.fullName;
      this.driver.email = this.firstFormGroup.value.email;
      this.driver.bankAccount = this.firstFormGroup.value.bankAccount;
      this.driver.makePriceOffer = this.firstFormGroup.value.makePriceOffer;
      this.driver.walletValue = this.firstFormGroup.value.walletValue;
      this.driver.vehicleSequenceNumber = this.firstFormGroup.value.vehicleSequenceNumber;
      this.driver.driverIdentityNumber = this.firstFormGroup.value.driverIdentityNumber;
      if (this.firstFormGroup.value.vehicleType.value) {
        this.driver.vehicleType = this.firstFormGroup.value.vehicleType.value;
      } else if (!this.firstFormGroup.value.vehicleType.value && this.subCats) {
        this.driver.vehicleType = this.subCats[0].value;
      }
      this.driver.companyId = this.firstFormGroup.value.company.value;
      this.driver.offDuty = !this.firstFormGroup.get("offDuty").value;
      this.driver.addressTitle = this.firstFormGroup.value.AddressTitle;
      this.driver.dateOfBirthGregorian = this.firstFormGroup.value.dateOfBirthGregorian;//.format("YYYYDDMM");;
      this.driver.dateOfBirthHijri = this.firstFormGroup.value.dateOfBirthHijri;//.format("YYYYDDMM");
      this.driver.plate = this.firstFormGroup.value.plate;
      this.driver.plateTypeId = this.firstFormGroup.value.plateType.value;
      this.driver.lat = this.latitude;
      this.driver.long = this.longitude;
      // console.log("update driver data : ", this.driver);

      this.save();
    }
  }

  onForthFromSubmit() {
    if (this.firstFormSaving === false) {
      this.onFirstFromSubmit();
    }

    this.forthFormSaving = true;

    if (this.firstFormGroup.valid && this.forthFormGroup.valid) {
      this.driver.profilePicture = (<string>this.userImageSrc1).slice(
        (<string>this.userImageSrc1).indexOf(",") + 1
      );
      this.driver.identityPicture = (<string>this.userImageSrc2).slice(
        (<string>this.userImageSrc2).indexOf(",") + 1
      );
      this.driver.frontVehiclePicture = (<string>this.userImageSrc3).slice(
        (<string>this.userImageSrc3).indexOf(",") + 1
      );
      this.driver.backVehiclePicture = (<string>this.userImageSrc4).slice(
        (<string>this.userImageSrc4).indexOf(",") + 1
      );
      this.driver.lisencePicture = (<string>this.userImageSrc5).slice(
        (<string>this.userImageSrc5).indexOf(",") + 1
      );
      this.driver.vehicleLisencePicture = (<string>this.userImageSrc6).slice(
        (<string>this.userImageSrc6).indexOf(",") + 1
      );
      this.save();
    }
  }

  save() {
    // console.log("update driver data 2 : ", this.driver);
    this._personnelService
      .updateProfile(<AdminUpdateDriverDto>this.driver)
      .pipe(finalize(() => {}))
      .subscribe((res) => {
        if (res.success) {
          message.Toast.fire(res.message);
        } else {
          this.message.error(
            res.message,
            this.l("SystemNotification")
          );

        }

      });
  }
}
