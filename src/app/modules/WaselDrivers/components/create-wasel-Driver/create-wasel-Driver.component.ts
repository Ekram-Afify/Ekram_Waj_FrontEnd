import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CategoryDto, CompanyServiceProxy, CreateCategoryDto, UpdateCompanyDto, AdminDriverServiceProxy, RegDriverVM } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SaveEditableRow } from 'primeng/table/table';
import { message } from '@shared/Message/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-wasel-Driver',
  templateUrl: './create-wasel-Driver.component.html',
  styleUrls: ['./create-wasel-Driver.component.scss']
})
export class CreateWaselDriverComponent extends AppComponentBase implements OnInit {
  @ViewChild('Supportingfiles', { static: false }) Supportingfiles;

  firstFormSaving = false;

  _id: any;

  driverReg: RegDriverVM = new RegDriverVM();
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
  objectAdditionalAttachments: any = {};
  researchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalAttachments: any[] = [];
  FinalResearchAdditionalDescriptions: any[] = [];
  Hijri: any;
  constructor(injector: Injector,
    private _formBuilder: FormBuilder, private _companyService: AdminDriverServiceProxy,
    private route: ActivatedRoute, private _router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.Hijri = {
      firstDayOfWeek: 0,
      monthNames: 'محرم_صفر_ربيع الأول_ربيع الثاني_جمادى الأول_جمادى الآخر_رجب_شعبان_رمضان_شوال_ذو القعدة_ذو الحجة'.split('_'),
      monthNamesShort: 'محرم_صفر_ربيع1_ربيع2_جمادى1_جمادى2_رجب_شعبان_رمضان_شوال_القعدة_الحجة'.split('_'),
      dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      dayNamesShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
      dayNamesMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
      today: 'اليوم',
      clear: 'Clear',
      dateFormat: 'mm/dd/yy',
      weekHeader: 'Wk' ,
      firstDay: 1,
		isRTL: true
      
  };
    this.items = [
      { label: this.l('Drivers') },
      { label: this.l('RegisterDriver') }
    ];

    this.initFirstFormGroup();
    // this.initJobRoles();

    this.basicFormGroupSupportingfiles = this._formBuilder.group({
      controlNameAdditionalFile: ['', Validators.required],
      FileDescription: [''],
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this._id = params['id'];
      }
    });
  }


  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(10)]],
      dateOfBirthGregorian: ['', [Validators.required, Validators.maxLength(512)]],
      dateOfBirthHijri: ['', [Validators.required, Validators.maxLength(512)]],
      description: ['', [Validators.required, Validators.maxLength(512)]],
      descriptionAr: ['', [Validators.required, Validators.maxLength(512)]],
    });
  }

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
    this.basicFormGroupSupportingfiles.get('controlNameAdditionalFile').setValue(files.files[0].name);
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
        objectURL: { changingThisBreaksApplicationSecurity: objectURL === 'image' ?
         this.DataAdditionalfile.objectURL.changingThisBreaksApplicationSecurity : objectURL },
        FileDescription: this.basicFormGroupSupportingfiles.get('FileDescription').value
      };
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
      this.driverReg.identityNumber = this.firstFormGroup.value.name;
      this.driverReg.dateOfBirthGregorian = this.firstFormGroup.value.dateOfBirthGregorian;
      this.driverReg.dateOfBirthHijri = this.firstFormGroup.value.dateOfBirthHijri;
      this.driverReg.mobileNumber = this.firstFormGroup.value.description;
      this.driverReg.email = this.firstFormGroup.value.descriptionAr;
      this.save();
    }
  }


  save() {


    this._companyService
      .registerDriver(this.driverReg)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        message.Toast.fire(this.l(res));
      });
  }

  cancel() {
    this._router.navigate(['/app/waselDrivers']);
  }
}

