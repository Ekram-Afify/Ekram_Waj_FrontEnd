import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DriversRoutingModule } from "./drivers-routing.module";
import { ShowDriversComponent } from "./components/show-drivers/show-drivers.component";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "@shared/shared.module";
import { UpdateDriverComponent } from "./components/update-driver/update-driver.component";
import { DetailsComponent } from "../drivers/components/details/details.component";
import { CreateDriverComponent } from "./components/create-driver/create-driver.component";
import { RegisterDriverComponent } from "./components/register-driver/register-driver.component";
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [
    ShowDriversComponent,
    UpdateDriverComponent,
    DetailsComponent,
    CreateDriverComponent,
    RegisterDriverComponent,
  ],
  imports: [
    CommonModule,
    DriversRoutingModule,
    HttpClientModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDvQj5-9vkArSGzhY9EE1NY3wTHWvKn6pU",
      libraries: ["places", "geometry", "drawing"],
    }),
  ],
})
export class DriversModule {}
