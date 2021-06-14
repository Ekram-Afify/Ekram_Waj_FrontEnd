import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import {  CategoryDto, AdminCategoryServiceProxy, CreateCategoryDto, AdminUpdateClientAdressDto, AdminClientAdressServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SaveEditableRow } from 'primeng/table/table';
import { message } from '@shared/Message/message';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-update-customer-address',
  templateUrl: './update-customer-address.component.html',
  styleUrls: ['./update-customer-address.component.scss']
})
export class UpdateCustomerAddressComponent extends AppComponentBase implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;

  firstFormSaving: boolean = false;
  
  _id: any;
  
  customerAddress: AdminUpdateClientAdressDto = new AdminUpdateClientAdressDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;

  destinationAddress;
  destinationlatitude:any;
  destinationlongitude:any;
  zoom:any=12;
  geoCoder:any;
  
  JobRole: SelectItem[] = [];

  basicFormGroupSupportingfiles: FormGroup;
  userImageSrc: any = "";
  uploadedFiles: any[] = [];
  currentFiles: any[] = [];
  DataAdditionalfile: any = {};
  UploadImage: any;
  objectAdditionalAttachments: any = {}
  researchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalDescriptions: any[] = [];
  constructor(injector: Injector,
    private _formBuilder: FormBuilder, private _customerAddressService: AdminClientAdressServiceProxy,
    private route: ActivatedRoute,private _router: Router,private maps: MapsAPILoader) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l('CustomerAddresses') },
      { label: this.l('UpdateCustomerAddress') }
    ];

    this.initFirstFormGroup();
    // this.initJobRoles();
    


    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ["", Validators.required],
      FileDescription: [""],
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this._id = params['id'];
      }
    });

    if (this._id) {
      this._customerAddressService.get(this._id).subscribe(result => {
        debugger;
        this.customerAddress = result;
        debugger;
        this.customerAddress = result;
        this.destinationlatitude=this.customerAddress.langLat.split(",")[1];
        this.destinationlongitude=this.customerAddress.langLat.split(",")[0];
        this.patchFirstFormGroup();
        this.maps.load().then(() => {
          this.zoom = 12;
          this.geoCoder = new google.maps.Geocoder();
      });
      });
    }
    
  }


  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
        adress: ['', [Validators.required, Validators.maxLength(512)]],
        title: ['', [Validators.required, Validators.maxLength(512)]],
        langLat: ['', [Validators.required, Validators.maxLength(512)]],
    });
  }

  patchFirstFormGroup() {
    this.firstFormGroup.patchValue({
      adress: this.customerAddress.adress,
      title: this.customerAddress.title,
      langLat: this.customerAddress.langLat,
  
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

  clearInput(name) {
  }
  onFilePDFSelect(files: any) {
    this.PdfFile = files.files[0];
  }
  clearFile(fileUpload) {
    this.PdfFile = null;
    fileUpload.clear();
  }

  ImagePreview(files) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert(this.l('OnlyImagesAreSupported'));
      return;
    }

    var reader = new FileReader();
    this.UploadImage = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
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
    $(".form-field-multi-fileUpload p-fileupload .ui-fileupload .ui-fileupload-buttonbar .ui-fileupload-choose input").click();
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
    this.basicFormGroupSupportingfiles.get("controlNameAdditionalFile").setValue(files.files[0].name)
  }
  removeFileAdditionalFile(file: any, AdditionalFile) {
    AdditionalFile.value = "";
    this.basicFormGroupSupportingfiles.get("controlNameAdditionalFile").setValue("");
  }
  fieldTextarea(name) {
    this.basicFormGroupSupportingfiles.get("FileDescription").setValue("");
  }
  AddSupportingfiles() {
    const objectTypeURL = new Object(this.DataAdditionalfile) as any;
    let objectURL = "";
    if (objectTypeURL.type === "application/pdf") {
      objectURL = "pdf";
    } else if (objectTypeURL.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      objectURL = "wordprocessingml";
    } else if (objectTypeURL.type === "image/png" || objectTypeURL.type === "image/jpeg") {
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
        objectURL: { changingThisBreaksApplicationSecurity: objectURL === "image" ? this.DataAdditionalfile.objectURL.changingThisBreaksApplicationSecurity : objectURL },
        FileDescription: this.basicFormGroupSupportingfiles.get("FileDescription").value
      }
      this.researchAdditionalAttachments.push(this.objectAdditionalAttachments);
      this.FinalResearchAdditionalAttachments.push(this.DataAdditionalfile);
      this.FinalResearchAdditionalDescriptions.push(this.objectAdditionalAttachments.FileDescription);

      this.Supportingfiles.hide();
      this.basicFormGroupSupportingfiles.reset();
    } else {
      this.Supportingfiles.hide();
      this.basicFormGroupSupportingfiles.reset();
    }
  }


 
  onFirstFromSubmit() {
debugger;
    this.firstFormSaving = true;
    if (this.firstFormGroup.valid) {
    this.customerAddress.adress = this.firstFormGroup.value.adress;
    this.customerAddress.title = this.firstFormGroup.value.title;
    this.customerAddress.langLat = this.destinationlatitude+","+this.destinationlongitude;
    this.save();
    }
  }


  save() {

    this._customerAddressService
      .update(this.customerAddress)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(() => {
        message.Toast.fire(this.l('SavedSuccessfully'));
      });
  }

  cancel(){
    this._router.navigate(['/app/customerAddresses']);
  }


  destinationgetAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            debugger;
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
    this.firstFormGroup.get("langLat").setValue(this.destinationlatitude+","+this.destinationlongitude);
    debugger;
  }
  
  destinationsetCurrentLocation() {
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.destinationlatitude = position.coords.latitude;
        this.destinationlongitude = position.coords.longitude;
        this.zoom = 8;
        this.destinationgetAddress(
          this.destinationlatitude,
          this.destinationlongitude
        );
      });
      this.firstFormGroup.get("langLat").setValue(this.destinationlatitude+","+this.destinationlongitude);
    }
    debugger;
  }
  destinationplaceMarker($event) {
    this.destinationlatitude = $event.coords.lat;
    this.destinationlongitude = $event.coords.lng;
    this.destinationgetAddress(
      this.destinationlatitude,
      this.destinationlongitude
    );
    this.firstFormGroup.get("langLat").setValue(this.destinationlatitude+","+this.destinationlongitude);
    debugger;
  }
  
  setdestinationAddress() {
    this.destinationAddress= (this.destinationAddress);
    debugger;
  }

}

