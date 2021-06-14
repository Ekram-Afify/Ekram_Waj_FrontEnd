import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import {  TokenAuthServiceProxy, AdminUpdateCompanyClientDto, AdminCompanyClientDto, AdminCompanyClientServiceProxy, CompanyServiceProxy, CompanyDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SaveEditableRow } from 'primeng/table/table';
import { message } from '@shared/Message/message';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-update-company-client',
  templateUrl: './update-company-client.component.html',
  styleUrls: ['./update-company-client.component.scss']
})
export class UpdateCompanyClientComponent extends AppComponentBase implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;

  firstFormSaving: boolean = false;
  
  _id: any;
  
  companyClient: AdminUpdateCompanyClientDto = new AdminUpdateCompanyClientDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;
  
  JobRole: SelectItem[] = [];
  categories: SelectItem[] = [];

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
    private _formBuilder: FormBuilder, private _companyClientService: AdminCompanyClientServiceProxy,
     private _tokenAuthtService: TokenAuthServiceProxy, private route: ActivatedRoute,private _router: Router
     ,private _categoryService: CompanyServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l('CompanyClients') },
      { label: this.l('UpdateCompanyClient') }
    ];

    this.initFirstFormGroup();
    // this.initJobRoles();
    this.initCatss();
    


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
      this._companyClientService.get(this._id).subscribe(result => {
        debugger;
        this.companyClient = result;
        this.patchFirstFormGroup();
      });
    }
    
  }


  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      phone: ['', [Validators.required, Validators.maxLength(512)]],
      email: ['', [Validators.required, Validators.maxLength(512)]],
      fullName: ['', [Validators.required, Validators.maxLength(512)]],
      companyId: ['', [Validators.required, Validators.maxLength(512)]],
    });
  }

  patchFirstFormGroup() {
    this.firstFormGroup.patchValue({
      phone: this.companyClient.phone,
      fullName: this.companyClient.fullName,
      email: this.companyClient.email,
      companyId: this.categories.find(c => c.value == this.companyClient.companyId)
    });
  }

  
  initCatss() {
    this._categoryService
      .getAll("","",0,1000)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result : CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.categories = [];
        this.categories.push({ label: this.l('company'), value: null });
        ReqResult.forEach(element => {
          this.categories.push({ label: element.name, value: element.id });
        });
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
      this.companyClient.phone = this.firstFormGroup.value.phone;
      this.companyClient.email = this.firstFormGroup.value.email;
      this.companyClient.fullName = this.firstFormGroup.value.fullName;
      this.companyClient.companyId = this.firstFormGroup.value.companyId.value;
    this.save();
    }
  }


  save() {

    this._tokenAuthtService.updateCompanyClient(this.companyClient)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(() => {
        message.Toast.fire(this.l('SavedSuccessfully'));
      });
  }

  cancel(){
    this._router.navigate(['/app/companyClients']);
  }

}

