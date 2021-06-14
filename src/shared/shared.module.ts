import { RadioButtonModule } from "primeng/radiobutton";
import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { AbpModule } from "@abp/abp.module";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { AppSessionService } from "./session/app-session.service";
import { AppUrlService } from "./nav/app-url.service";
import { AppAuthService } from "./auth/app-auth.service";
import { AppRouteGuard } from "./auth/auth-route-guard";
import { AbpPaginationControlsComponent } from "./pagination/abp-pagination-controls.component";
import { LocalizePipe } from "@shared/pipes/localize.pipe";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { FileUploadModule } from "primeng/fileupload";
import { ModalModule } from "ngx-bootstrap/modal";
import { CalendarModule } from "primeng/calendar";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from "@angular/material";
import { BlockDirective } from "./directives/block.directive";
import { BusyDirective } from "./directives/busy.directive";
import { EqualValidator } from "./directives/equal-validator.directive";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { SafePipe } from "./pipes/safe.pipe";
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    AbpModule,
    RouterModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    ModalModule.forRoot(),
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    DropdownModule,
    DragDropModule,
    InputTextModule,
    MatTreeModule,
    ToastModule,
    FileUploadModule
  ],
  declarations: [
    AbpPaginationControlsComponent,
    LocalizePipe,
    BlockDirective,
    BusyDirective,
    EqualValidator,
    SafePipe,

  ],
  exports: [
    AbpPaginationControlsComponent,
    LocalizePipe,
    BlockDirective,
    BusyDirective,
    TableModule,
    CalendarModule,
    TabViewModule,
    FileUploadModule,
    EqualValidator,
    CdkTableModule,
    CdkTreeModule,
    ReactiveFormsModule,
    DropdownModule,
    DragDropModule,
    InputTextModule,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    TooltipModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    BreadcrumbModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    CalendarModule,
    FileUploadModule,
    RadioButtonModule,
    ToastModule,
    FileUploadModule,
    ModalModule,
    SafePipe,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AppSessionService,
        AppUrlService,
        AppAuthService,
        AppRouteGuard
      ],
    };
  }
}
