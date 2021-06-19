import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { HomeComponent } from "./home/home.component";
import { UsersComponent } from "./users/users.component";
import { RolesComponent } from "./roles/roles.component";
import { BillComponent } from "./modules/reservations/components/bill/bill.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AppComponent,
        children: [
          {
            path: "home",
            component: HomeComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "users",
            component: UsersComponent,
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          }
          ,
          {
            path: "changePassword",
            component: ChangePasswordComponent,
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "companies",
            loadChildren: () =>
              import("./modules/companies/companies.module").then(
                (m) => m.CompaniesModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "PanelUsers",
            loadChildren: () =>
              import("./modules/panel-users/panel-users.module").then(
                (m) => m.PanelUsersModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "coupons",
            loadChildren: () =>
              import("./modules/coupons/coupons.module").then(
                (m) => m.CouponsModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "orders",
            loadChildren: () =>
              import("./modules/follow-orders/follow-orders.module").then(
                (m) => m.FollowOrdersModule
              ),
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "drivers",
            loadChildren: () =>
              import("./modules/drivers/drivers.module").then(
                (m) => m.DriversModule
              ),
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "customers",
            loadChildren: () =>
              import("./modules/customers/customers.module").then(
                (m) => m.CustomersModule
              ),
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "client-company-reservations",
            loadChildren: () =>
              import("./modules/client-company-reservations/client-company-reservations.module").then(
                (m) => m.ClientCompanyReservationsModule
              ),
              data: { permission: "Pages.ClientCompany" },
          },
          {
            path: "reservations",
            loadChildren: () =>
              import("./modules/reservations/reservations.module").then(
                (m) => m.ReservationsModule
              ),
          },
          {
            path: "coupons",
            loadChildren: () =>
              import("./modules/coupons/coupons.module").then(
                (m) => m.CouponsModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "customerAddresses",
            loadChildren: () =>
              import("./modules/client-addresses/client-addresses.module").then(
                (m) => m.ClientAddressesModule
              ),
          },
          {
            path: "chat",
            loadChildren: () =>
              import("./modules/Chat/chat/chat.module").then(
                (m) => m.ChatModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "categories",
            loadChildren: () =>
              import("./modules/categories/categories.module").then(
                (m) => m.CategoriesModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "subcategories",
            loadChildren: () =>
              import("./modules/Subcategories/subcategories.module").then(
                (m) => m.SubcategoriesModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "vechiles",
            loadChildren: () =>
              import("./modules/Vechiles/vechiles.module").then(
                (m) => m.VechilesModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "waselDrivers",
            loadChildren: () =>
              import("./modules/WaselDrivers/wasel-drivers.module").then(
                (m) => m.WaselDriversModule
              ),
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "reports",
            loadChildren: () =>
              import("./modules/reports/reports.module").then(
                (m) => m.ReportsModule
              ),
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "companyClients",
            loadChildren: () =>
              import("./modules/company-clients/company-clients.module").then(
                (m) => m.CompanyClientsModule
              ),
            data: { permission: "Pages.ClientCompany" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "notifications",
            loadChildren: () =>
              import("./modules/notifications/notifications.module").then(
                (m) => m.NotificationsModule
              ),
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
