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
  AdminCreatePanelUserDto,
  AdminPanelUserDto,
  AdminPanelUserServiceProxy,
  AdminUpdatePanelUserDto,
  CompanyDtoPagedResultDto,
  CompanyServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { SaveEditableRow } from "primeng/table/table";
import { message } from "@shared/Message/message";
import { ActivatedRoute, Router } from "@angular/router";
import { getRemoteServiceBaseUrl } from "root.module";
import { getCurrentLanguage } from "../../../../root.module";
// import { AdminPanelUserServiceProxy } from '../../../../shared/service-proxies/service-proxies';

@Component({
  selector: "app-panel-user-page",
  templateUrl: "./panel-user-page.component.html",
  styleUrls: ["./panel-user-page.component.scss"],
})
export class PanelUserPageComponent extends AppComponentBase implements OnInit {
  firstFormSaving = false;

  _id: any;

  customer: AdminCreatePanelUserDto = new AdminCreatePanelUserDto();
  customer2: AdminPanelUserDto = new AdminPanelUserDto();
  updateCustomer: AdminUpdatePanelUserDto = new AdminUpdatePanelUserDto();
  centers;
  isLinear = false;
  items: MenuItem[];
  firstFormGroup: FormGroup;
  PdfFile: File;

  Roles = [
    {
      label: this.l("ClientCompany"),
      value: 8,
    },
    {
      label: this.l("Admin"),
      value: 1,
    },
  ];

  companies: SelectItem[] = [];
  constructor(
    injector: Injector,
    private _categoryService: CompanyServiceProxy,
    private _formBuilder: FormBuilder,
    private _PanelService: AdminPanelUserServiceProxy,
    private route: ActivatedRoute,
    private _router: Router
  ) {
    super(injector);
    this.initComps();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this._id = params["id"];
        this._PanelService.getById(this._id).subscribe((res) => {
          this.customer2 = res;
          this.patchFirstFormGroup();
          // if (this.companies.length != 0) {
          //   console.log("test");

          //   console.log(
          //     "customer2 : ",
          //     this.companies.find((c) => c.value === this.customer2.companyId)
          //   );

          //   // this.firstFormGroup.controls.companyId.setValue(
          //   //   this.companies.find((c) => c.value === this.customer2.companyId)
          //   // );
          // }
        });
      }
    });
  }

  ngOnInit() {
    this.items = [
      { label: this.l("PanelUsers") },
      this._id == undefined
        ? { label: this.l("AddPanelUser") }
        : { label: this.l("UpdatePanelUser") },
    ];

    this.initFirstFormGroup();
  }
  initComps() {
    this._categoryService
      .getAll("", "", 0, 1000)
      .pipe(finalize(() => {}))
      .subscribe((result: CompanyDtoPagedResultDto) => {
        const ReqResult = result.items;

        this.companies = [];
        this.companies.push({ label: this.l("Company"), value: null });
        ReqResult.forEach((element) => {
          const comName =
            getCurrentLanguage() === "en" ? element.name : element.nameAr;
          this.companies.push({ label: comName, value: element.id });
        });
      });
  }

  initFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      isActive: ["", [Validators.required]],
      phone: ["", [Validators.required, Validators.maxLength(512)]],
      email: ["", [Validators.required, Validators.maxLength(512)]],
      firstName: ["", [Validators.required, Validators.maxLength(512)]],
      username: ["", [Validators.required, Validators.maxLength(512)]],
      lastName: ["", [Validators.required, Validators.maxLength(512)]],
      companyId: ["", [Validators.required]],
      roleNames: [""],
      password: ["", [Validators.required, Validators.maxLength(512)]],
    });
  }
  patchFirstFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      phone: [this.customer2.phone],
      email: [
        this.customer2.email,
        [Validators.required, Validators.maxLength(512)],
      ],
      firstName: [
        this.customer2.firstName,
        [Validators.required, Validators.maxLength(512)],
      ],
      username: [
        this.customer2.username,
        [Validators.required, Validators.maxLength(512)],
      ],
      lastName: [
        this.customer2.lastName,
        [Validators.required, Validators.maxLength(512)],
      ],
      companyId: [
        this.companies.find((c) => c.value === this.customer2.companyId),
        [Validators.required],
      ],
      roleNames: [this.Roles.find((c) => c.value === this.customer2.role.id)],
      password: [
        this.customer2.password != null
          ? this.customer2.password.slice(0, 5)
          : "",
        [Validators.required, Validators.maxLength(512)],
      ],
      isActive: [this.customer2.isActive, [Validators.required]],
      // company: [
      //   this.companies.find((c) => c.value === this.driver.companyId),
      //   [Validators.required, Validators.maxLength(512)],
      // ],
    });
  }
  clearInput(name) {
    this.firstFormGroup.get(name).setValue("");
  }

  onFirstFromSubmit() {
    this.firstFormSaving = true;
    if (this.firstFormGroup.valid) {
      this.customer.phone = this.firstFormGroup.value.phone;
      this.customer.firstName = this.firstFormGroup.value.firstName;
      this.customer.password = this.firstFormGroup.value.password;
      this.customer.username = this.firstFormGroup.value.username;
      this.customer.lastName = this.firstFormGroup.value.lastName;
      this.customer.isActive = this.firstFormGroup.value.isActive;
      this.customer.email = this.firstFormGroup.value.email;
      this.customer.roleNames =
        this.firstFormGroup.value.roleNames.value == 1
          ? ["Admin"]
          : ["ClientCompany"];
      this.customer.companyId = this.firstFormGroup.value.companyId.value;

      this.updateCustomer.phone = this.firstFormGroup.value.phone;
      this.updateCustomer.firstName = this.firstFormGroup.value.firstName;
      if (this.customer2.password !=undefined &&
        this.customer2.password.slice(0, 5) === this.firstFormGroup.value.password

      ) {
        this.updateCustomer.password = this.customer2.password;
      } else {
        this.updateCustomer.password = this.firstFormGroup.value.password;
      }

      this.updateCustomer.username = this.firstFormGroup.value.username;
      this.updateCustomer.isActive = this.firstFormGroup.value.isActive;
      this.updateCustomer.lastName = this.firstFormGroup.value.lastName;
      this.updateCustomer.email = this.firstFormGroup.value.email;
      this.updateCustomer.roleNames =
        this.firstFormGroup.value.roleNames.value == 1
          ? ["Admin"]
          : ["ClientCompany"];
      this.updateCustomer.companyId = this.firstFormGroup.value.companyId.value;
      this.updateCustomer.id = this._id;

      this.save();
    }
  }

  save() {
    if (!this._id) {
      this._PanelService
        .createPanelUser(this.customer)
        .pipe(finalize(() => {}))
        .subscribe(() => {
          message.Toast.fire(this.l("SavedSuccessfully"));
          this._router.navigate(["/app/PanelUsers"]);
        });
    } else {
      this._PanelService
        .updatePanelUser(this.updateCustomer)
        .pipe(finalize(() => {}))
        .subscribe(() => {
          message.Toast.fire(this.l("SavedSuccessfully"));
          this._router.navigate(["/app/PanelUsers"]);
        });
    }
  }

  cancel() {
    this._router.navigate(["/app/PanelUsers"]);
  }
}
