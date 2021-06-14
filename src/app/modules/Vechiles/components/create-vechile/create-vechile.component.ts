import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import {  CreateAdminVechileDto, AdminVechileServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { message } from '@shared/Message/message';
import { Router, ActivatedRoute } from '@angular/router';
import { getCurrentLanguage } from 'root.module';
import { PlateTypeDtoPagedResultDto, PlateTypesServiceProxy } from '../../../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-vechile',
  templateUrl: './create-vechile.component.html',
  styleUrls: ['./create-vechile.component.scss']
})
export class CreateVechileComponent extends AppComponentBase implements OnInit {
  @ViewChild('Supportingfiles', { static: false }) Supportingfiles;

  firstFormSaving = false;
  _id: any;

  platetypes: SelectItem[] = [];
  company: CreateAdminVechileDto = new CreateAdminVechileDto();
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
 
  constructor(injector: Injector, private _platetypesService: PlateTypesServiceProxy,
    private _formBuilder: FormBuilder, private _companyService: AdminVechileServiceProxy,private route: ActivatedRoute, private _router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l('vechiles') },
      { label: this.l('AddVechile') }
    ];
    this.initPlateTypes();
    this.initFirstFormGroup();
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


  initPlateTypes() {
    this._platetypesService
      .getAll('', '', 0, 1000)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((result: PlateTypeDtoPagedResultDto) => {
        const Result = result.items;

        this.platetypes = [];
        this.platetypes.push({ label: this.l('PlateType'), value: null });
        Result.forEach(element => {
          const itemname = getCurrentLanguage() === 'en' ? element.name : element.nameAr;
          this.platetypes.push({ label: itemname, value: element.id });
        });
      });

  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      plate: ['', [Validators.required, Validators.maxLength(512)]],
      plateType: ['', [Validators.required, Validators.maxLength(512)]],
      sequenceNumber: ['', [Validators.required, Validators.maxLength(512)]],
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
        objectURL: {
          changingThisBreaksApplicationSecurity: objectURL === 'image' ?
            this.DataAdditionalfile.objectURL.changingThisBreaksApplicationSecurity : objectURL
        },
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
      this.company.plate = this.firstFormGroup.value.plate;
      this.company.plateType = this.firstFormGroup.get('plateType').value.value;
      this.company.sequenceNumber = this.firstFormGroup.value.sequenceNumber;
      this.save();
    }
  }

  save() {
    this._companyService
      .createVechile(this.company)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        debugger;
        message.Toast.fire(this.l(res));
       
      });
  }




  cancel() {
    this._router.navigate(['/app/vechiles']);
  }

}
