import { AdminDriverDto, AdminDriverServiceProxy, AdminUpdateDriverDto, AdminSubcategoryDtoPagedResultDto, AdminSubategoryServiceProxy, CompanyServiceProxy, CompanyDtoPagedResultDto } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';

import { finalize } from 'rxjs/operators';
import { SaveEditableRow } from 'primeng/table/table';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { message } from '@shared/Message/message';
import { getRemoteServiceBaseUrl } from 'root.module';
import { getCurrentLanguage } from 'root.module';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild('Supportingfiles', { static: false }) Supportingfiles;

  driver: AdminDriverDto = new AdminDriverDto();
  _id: any;
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;

  categories: SelectItem[] = [];
  companies: SelectItem[] = [];

  Governorate: SelectItem[] = [];



  basicFormGroupSupportingfiles: FormGroup;
  profilePicture: any = '';
  identityPicture: any = '';
  lisencePicture: any = '';
  vehicleLisencePicture: any = '';
  frontVehiclePicture: any = '';
  backVehiclePicture: any = '';
  uploadedFiles: any[] = [];
  currentFiles: any[] = [];



  DataAdditionalfile: any = {};
  UploadImage: any;
  objectAdditionalAttachments: any = {}
  researchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalDescriptions: any[] = [];
  constructor(injector: Injector,
    private _formBuilder: FormBuilder, private _personnelService: AdminDriverServiceProxy,
    private route: ActivatedRoute, private _categoryService: AdminSubategoryServiceProxy,
    private _companyService: CompanyServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l('Drivers') },
      { label: this.l('DriverDetails') }
    ];







    // this.initGovernorates();




    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ['', Validators.required],
      FileDescription: [''],
    });


    this.route.params.subscribe(params => {
      if (params['id']) {
        this._id = params['id'];
      }
    });

    if (this._id) {
      this._personnelService.get(this._id).subscribe(result => {
        debugger;
        this.driver = result;
        // this.identityPicture = getRemoteServiceBaseUrl() + '/' + this.driver.identityPicture;
        // this.lisencePicture = getRemoteServiceBaseUrl() + '/' + this.driver.lisencePicture;
        // this.profilePicture = getRemoteServiceBaseUrl() + '/' + this.driver.profilePicture;
        // this.vehicleLisencePicture = getRemoteServiceBaseUrl() + '/' + this.driver.vehicleLisencePicture;
        // this.backVehiclePicture = getRemoteServiceBaseUrl() + '/' + this.driver.backVehiclePicture;
        // this.frontVehiclePicture = getRemoteServiceBaseUrl() + '/' + this.driver.frontVehiclePicture;

        this.initSubs();
        this.initCompanies();
      });
    }

  }







  initSubs() {
    this._categoryService
      .getAll('',
        undefined,
        '', 0, 1000)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result: AdminSubcategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.categories = [];
        this.categories.push({ label: this.l('Subcategory'), value: null });
        ReqResult.forEach(element => {
          this.categories.push({ label: getCurrentLanguage() === 'en' ? element.name : element.nameAr, value: element.id });
        });
        var t = this.categories.find(c => c.value == this.driver.vehicleType);
        this.categories = [];
        this.categories.push(t);
      });

  }


  initCompanies() {
    this._companyService
      .getAll('',
        '', 0, 1000)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result: CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.companies = [];
        this.companies.push({ label: this.l('Company'), value: null });
        ReqResult.forEach(element => {
          this.companies.push({ label: getCurrentLanguage() === 'en' ? element.name : element.nameAr, value: element.id });
        });
        debugger;
        var t = this.companies.find(c => c.value == this.driver.companyId);
        this.companies = [];
        this.companies.push(t);
      });

  }

  // initGovernorates() {
  //   this._governorateService
  //     .getAllForDropDownList()
  //     .pipe(
  //       finalize(() => {
  //       })
  //     )
  //     .subscribe((result: GetDepartmentDropDownListDto[]) => {
  //       var GovernoratesResult = result;

  //       this.Governorate = [];
  //       this.Governorate.push({ label: this.l('Governorate'), value: null });
  //       GovernoratesResult.forEach(element => {
  //         this.Governorate.push({ label: element.name, value: element.id });
  //       });
  //     });

  // }


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
      //this.userImageSrc = reader.result;
    };
  }
  uploadFileVehicle() {
    $('.upload-image-register-dealer').click();
  }
  RemoveuploadFileRegisterDealer() {
    //this.userImageSrc = "";
  }

  UploadAnotherFile() {
    $('.form-field-multi-fileUpload p-fileupload .ui-fileupload .ui-fileupload-buttonbar .ui-fileupload-choose input').click();
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
    this.basicFormGroupSupportingfiles.get('controlNameAdditionalFile').setValue(files.files[0].name)
  }
  removeFileAdditionalFile(file: any, AdditionalFile) {
    AdditionalFile.value = '';
    this.basicFormGroupSupportingfiles.get('controlNameAdditionalFile').setValue('');
  }
  fieldTextarea(name) {
    this.basicFormGroupSupportingfiles.get('FileDescription').setValue('');
  }
  AddSupportingfiles() {
    const objectTypeURL = new Object(this.DataAdditionalfile) as any;
    let objectURL = '';
    if (objectTypeURL.type === 'application/pdf') {
      objectURL = 'pdf';
    } else if (objectTypeURL.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      objectURL = 'wordprocessingml';
    } else if (objectTypeURL.type === 'image/png' || objectTypeURL.type === 'image/jpeg') {
      objectURL = 'image';
    } else {
      objectURL = 'wordprocessingml';
    }
    if (this.basicFormGroupSupportingfiles.valid) {
      this.objectAdditionalAttachments = {
        name: this.DataAdditionalfile.name,
        lastModified: this.DataAdditionalfile.lastModified,
        lastModifiedDate: this.DataAdditionalfile.lastModifiedDate,
        webkitRelativePath: this.DataAdditionalfile.webkitRelativePath,
        size: this.DataAdditionalfile.size,
        type: this.DataAdditionalfile.type,
        objectURL: { changingThisBreaksApplicationSecurity: objectURL === 'image' ? this.DataAdditionalfile.objectURL.changingThisBreaksApplicationSecurity : objectURL },
        FileDescription: this.basicFormGroupSupportingfiles.get('FileDescription').value
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






}
