import { RecoverPasswordDialogComponent } from './recover-password-dialog/recover-password-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { AbpModule } from '@abp/abp.module';
import { AccountRoutingModule } from './account-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountLanguagesComponent } from './layout/account-languages.component';
import { LoginService } from './login/login.service';
// tenants
import { TenantChangeComponent } from './tenant/tenant-change.component';
import { TenantChangeDialogComponent } from './tenant/tenant-change-dialog.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        AbpModule,
        SharedModule,
        ServiceProxyModule,
        AccountRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false
        }),
    ],
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        AccountLanguagesComponent,
        // tenant
        ResetPasswordComponent,
        TenantChangeComponent,
        TenantChangeDialogComponent,
        RecoverPasswordDialogComponent
    ],
    providers: [
        LoginService
    ],
    entryComponents: [
        // tenant
        TenantChangeDialogComponent,
        RecoverPasswordDialogComponent

    ]
})
export class AccountModule {
}