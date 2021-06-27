import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { SaveEditableRow } from 'primeng/table/table';
import { message } from '@shared/Message/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintDto, ComplaintServiceProxy } from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.scss']
})
export class ComplaintDetailsComponent  extends AppComponentBase implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;

    
  _id: any;
  
  complaint: ComplaintDto = new ComplaintDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  
  PdfFile: File;
  
  

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
    private _formBuilder: FormBuilder, private _complaintService: ComplaintServiceProxy,
    private route: ActivatedRoute,private _router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l('Complaints') },
      { label: this.l('ComplaintDetails') }
    ];

    
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
      this._complaintService.get(this._id).subscribe(result => {
        debugger;
        this.complaint = result;
      });
    }
    
  }








 
back(){
  this._router.navigate(['/app/complaints']);
}


}

