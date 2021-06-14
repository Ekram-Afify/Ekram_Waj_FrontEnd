import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CategoryDto, CreateCategoryDto, AdminUpdateClientDto,
   AdminClientServiceProxy, AdminCreateClientDto, CompanyDtoPagedResultDto, CompanyServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SaveEditableRow } from 'primeng/table/table';
import { message } from '@shared/Message/message';
import { ActivatedRoute, Router } from '@angular/router';
import { getRemoteServiceBaseUrl } from 'root.module';
import { getCurrentLanguage } from '../../../../../root.module';

@Component({
  selector: 'app-Create-customer',
  templateUrl: './Create-customer.component.html',
  styleUrls: ['./Create-customer.component.scss']
})
export class CreateCustomerComponent extends AppComponentBase implements OnInit {
  @ViewChild('Supportingfiles', { static: false }) Supportingfiles;

  firstFormSaving = false;

  _id: any;

  customer: AdminCreateClientDto = new AdminCreateClientDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;

  JobRole: SelectItem[] = [];

  basicFormGroupSupportingfiles: FormGroup;
  userImageSrc: any = '';
  uploadedFiles: any[] = [];
  currentFiles: any[] = [];
  DataAdditionalfile: any = {};
  UploadImage: any;
  objectAdditionalAttachments: any = {}
  researchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalDescriptions: any[] = [];
  companies: SelectItem[] = [];
  constructor(injector: Injector, private _companyService: CompanyServiceProxy,
    private _formBuilder: FormBuilder, private _customerService: AdminClientServiceProxy,
    private route: ActivatedRoute, private _router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.initComps();
    this.items = [
      { label: this.l('Customers') },
      { label: this.l('CreateCustomer') }
    ];

    this.initFirstFormGroup();
    // this.initJobRoles();



    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ['', Validators.required],
      FileDescription: [''],
    });



  }
  initComps() {
    this._companyService
      .getAll('', '', 0, 1000)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result: CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.companies = [];
        this.companies.push({ label: this.l('Company'), value: null });
        ReqResult.forEach(element => {
          const comName = getCurrentLanguage() === 'en' ? element.name : element.nameAr;
          this.companies.push({ label: comName, value: element.id });
        });
      });

  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      phone: ['', [Validators.required, Validators.maxLength(512)]],
      email: ['', [Validators.required, Validators.maxLength(512)]],
      firstName: ['', [Validators.required, Validators.maxLength(512)]],
      lastName: ['', [Validators.required, Validators.maxLength(512)]],
      walletValue: [''],
      companyId: ['']
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
  clearField(name) {
    this.firstFormGroup.get(name).setValue("");
  }
  ImagePreview(files) {
    if (files.length === 0) { return; }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert(this.l('OnlyImagesAreSupported'));
      return;
    }

    const reader = new FileReader();
    this.UploadImage = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.userImageSrc = reader.result;
    };
  }
  uploadFileVehicle() {
    $('.upload-image-register-dealer').click();
  }
  RemoveuploadFileRegisterDealer() {
    this.userImageSrc = '';
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
        objectURL: {
          changingThisBreaksApplicationSecurity: objectURL === 'image' ?
            this.DataAdditionalfile.objectURL.changingThisBreaksApplicationSecurity : objectURL
        },
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



  onFirstFromSubmit() {
    this.firstFormSaving = true;
    if (this.firstFormGroup.valid) {
      this.customer.phone = this.firstFormGroup.value.phone;
      this.customer.firstName = this.firstFormGroup.value.firstName;
      this.customer.lastName = this.firstFormGroup.value.lastName;
      this.customer.email = this.firstFormGroup.value.email;
      this.customer.picture = (<string>this.userImageSrc).slice((<string>this.userImageSrc).indexOf(',') + 1);
      this.customer.companyId = this.firstFormGroup.value.companyId.value;
      this.customer.walletValue = this.firstFormGroup.value.walletValue.value;
      this.save();
    }
  }


  save() {

    this._customerService
      .createProfile(this.customer)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(() => {
        message.Toast.fire(this.l('SavedSuccessfully'));
      });
  }

  cancel() {
    this._router.navigate(['/app/customers']);
  }

}

