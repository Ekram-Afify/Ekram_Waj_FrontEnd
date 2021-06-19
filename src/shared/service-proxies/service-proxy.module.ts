import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AbpHttpInterceptor } from "@abp/abpHttpInterceptor";

import * as ApiServiceProxies from "./service-proxies";

@NgModule({
  providers: [
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.ConfigurationServiceProxy,
    ApiServiceProxies.AdminCategoryServiceProxy,
    ApiServiceProxies.AdminSubategoryServiceProxy,
    ApiServiceProxies.CompanyServiceProxy,
    ApiServiceProxies.AdminDriverServiceProxy,
    ApiServiceProxies.AdminClientServiceProxy,
    ApiServiceProxies.AdminRequestServiceProxy,
    ApiServiceProxies.AdminClientAdressServiceProxy,
    ApiServiceProxies.AdminCompanyClientServiceProxy,
    ApiServiceProxies.AdminVechileServiceProxy,
    ApiServiceProxies.AdminWaselDriverServiceProxy,
    ApiServiceProxies.OfferPriceServiceProxy,
    ApiServiceProxies.PlateTypesServiceProxy,
    ApiServiceProxies.AdminOfferPriceServiceProxy,
    ApiServiceProxies.OfferPriceStatusServiceProxy,
    ApiServiceProxies.RequestStatusServiceProxy,
    ApiServiceProxies.CouponServiceProxy,
    ApiServiceProxies.TrackingTripServiceProxy,
    ApiServiceProxies.NotificationServiceProxy,
    ApiServiceProxies.AdminPanelUserServiceProxy,
    ApiServiceProxies.PaymentServiceProxy,
    ApiServiceProxies.CompanyDriversReuestsServiceProxy,

    { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
  ],
})
export class ServiceProxyModule {}
