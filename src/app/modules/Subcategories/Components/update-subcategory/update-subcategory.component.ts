import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Injector,
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
  CategoryDto,
  AdminSubategoryServiceProxy,
  CreateCategoryDto,
  AdminUpdateSubcategoryDto,
  AdminCategoryServiceProxy,
  AdminCategoryDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { SaveEditableRow } from "primeng/table/table";
import { message } from "@shared/Message/message";
import { ActivatedRoute, Router } from "@angular/router";
import { getRemoteServiceBaseUrl } from "root.module";
@Component({
  selector: "app-update-subcategory",
  templateUrl: "./update-subcategory.component.html",
  styleUrls: ["./update-subcategory.component.scss"],
})
export class UpdateSubcategoryComponent
  extends AppComponentBase
  implements OnInit {
  @ViewChild("Supportingfiles", { static: false }) Supportingfiles;

  firstFormSaving: boolean = false;

  _id: any;

  subcategory: AdminUpdateSubcategoryDto = new AdminUpdateSubcategoryDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;
  categories: SelectItem[] = [];

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
  constructor(
    injector: Injector,
    private _formBuilder: FormBuilder,
    private _subcategoryService: AdminSubategoryServiceProxy,
    private route: ActivatedRoute,
    private _router: Router,
    private _categoryService: AdminCategoryServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.items = [
      { label: this.l("SubCategories") },
      { label: this.l("UpdateSubCategory") },
    ];

    this.initFirstFormGroup();
    this.initCatss();
    // this.initJobRoles();

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
      this._subcategoryService.get(this._id).subscribe((result) => {
        debugger;
        this.subcategory = result;
        this.userImageSrc =
          getRemoteServiceBaseUrl() + "/" + this.subcategory.image;
        this.patchFirstFormGroup();
      });
    }
  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(512)]],
      nameAr: ["", [Validators.required, Validators.maxLength(512)]],
      nameFa: ["", [Validators.required, Validators.maxLength(512)]],
      description: ["", [Validators.required, Validators.maxLength(512)]],
      descriptionAr: ["", [Validators.required, Validators.maxLength(512)]],
      descriptionFa: ["", [Validators.required, Validators.maxLength(512)]],
      categoryId: ["", [Validators.required, Validators.maxLength(512)]],
    });
  }

  patchFirstFormGroup() {
    this.firstFormGroup.patchValue({
      name: this.subcategory.name,
      nameAr: this.subcategory.nameAr,
      nameFa: this.subcategory.nameFa,
      description: this.subcategory.description,
      descriptionAr: this.subcategory.descriptionAr,
      descriptionFa: this.subcategory.descriptionFa,
      categoryId: this.categories.find(
        (c) => c.value == this.subcategory.categoryId
      ),
    });
  }

  initCatss() {
    this._categoryService
      .getAll("", "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: AdminCategoryDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.categories = [];
        this.categories.push({ label: this.l("category"), value: null });
        ReqResult.forEach((element) => {
          this.categories.push({ label: element.name, value: element.id });
        });
      });
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
    this.userImageSrc = null;
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert(this.l("OnlyImagesAreSupported"));
      return;
    }

    var reader = new FileReader();
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

  onFirstFromSubmit() {
    debugger;
    this.firstFormSaving = true;
    if (this.firstFormGroup.valid) {
      this.subcategory.name = this.firstFormGroup.value.name;
      this.subcategory.nameAr = this.firstFormGroup.value.nameAr;
      this.subcategory.nameFa = this.firstFormGroup.value.nameFa;
      this.subcategory.description = this.firstFormGroup.value.description;
      this.subcategory.descriptionAr = this.firstFormGroup.value.descriptionAr;
      this.subcategory.descriptionFa = this.firstFormGroup.value.descriptionFa;
      this.subcategory.categoryId = this.firstFormGroup.value.categoryId.value;
      this.subcategory.image = (<string>this.userImageSrc).slice(
        (<string>this.userImageSrc).indexOf(",") + 1
      );

      this.save();
    }
  }

  save() {
    this._subcategoryService
      .update(this.subcategory)
      .pipe(finalize(() => {}))
      .subscribe(() => {
        message.Toast.fire(this.l("SavedSuccessfully"));
      });
  }

  cancel() {
    this._router.navigate(["/app/subcategories"]);
  }
}
