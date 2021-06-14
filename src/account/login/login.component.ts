import { Component, Injector, ViewChild } from '@angular/core';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { LoginService } from './login.service';
import { MatDialog } from '@angular/material';
import { RecoverPasswordDialogComponent } from 'account/recover-password-dialog/recover-password-dialog.component';
import { TokenAuthServiceProxy, AuthenticateByPhoneModel } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent extends AppComponentBase {
  submitting = false;
  maxLength = 10;
  isMobileFormat = true;
  isOverMax = false;
  isFormValid = false;
  saving = false;
  @ViewChild('loginForm', { static: false }) form: NgForm;
  constructor(
    injector: Injector,
    public loginService: LoginService,
    private _sessionService: AbpSessionService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _dialog: MatDialog
  ) {
    super(injector);
  }


  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    debugger;

   this.saving = true;

      this.loginService.authenticate(() => {
        this.saving = false;

      });


  }
  clearInput(name) {

  }
  // onchangePhoneNumber() {
  //   if (this.loginService.authenticateModel.phone.length > this.maxLength) {
  //     this.isOverMax = true;
  //     this.isFormValid = true;
  //   } else {
  //     this.isOverMax = false;
  //     this.isFormValid = false;
  //   }
  //   if ((this.loginService.authenticateModel.phone.startsWith('5') && this.loginService.authenticateModel.phone.length === 9) ||
  //     this.loginService.authenticateModel.phone.startsWith('05')) {
  //     this.isMobileFormat = true;
  //     this.isFormValid = true;
  //   } else {
  //     this.isMobileFormat = false;
  //     this.isFormValid = false;
  //   }
  // }

  // resetPassword(): void {
  //   debugger;
  //   this._dialog.open(RecoverPasswordDialogComponent, {
  //     width: '500px',
  //     position: {
  //       top: '50px'
  //     }
  //   });
  // }


}
