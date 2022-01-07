import { ExistingOrganizationValidatorDirective } from "./validators/existing-organization.validator";
import {
  ExistingEmailValidatorDirective,
  ExistingUsernameValidatorDirective,
  ExistingSubdomainValidatorDirective
} from "@shared/validators";
import { NgxSpinnerModule } from "ngx-spinner";
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CdkTreeModule } from "@angular/cdk/tree";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { PasswordStrengthComponent } from "./components/password-strength/password-strength.component";
import {
  FixedPluginComponent,
  FooterComponent,
  NavbarComponent,
  SidebarComponent,
  TestScriptMenuComponent,
  ErrorComponent,
  CustomTextBoxComponent,
  AgGridActionCellRendererComponent,
  MultiValueChipComponent,
  UnAuthorizedComponent,
  AddLocatorComponent,
  AddPagesComponent
} from "./components";
import {
  OverlayContainer,
  FullscreenOverlayContainer
} from "@angular/cdk/overlay";
import { SlugPipe, SortByPipe, OrderPipe } from "./pipes";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { StatusBarComponent } from "./components/status-bar/status-bar.component";
import { ComingSoonComponent } from "@app/content/admin/coming-soon/coming-soon.component";
import { ScreenShotComponent } from "./components/screen-shot/screen-shot.component";
import { MatMenuPreventDirective } from "./directives";
// import { AddLocatorComponent } from './components/add-locator/add-locator.component';
// import { AddPagesComponent } from './components/add-pages/add-pages.component';

const MATERIAL_COMPONENTS = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
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
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatStepperModule,
  CdkTreeModule,
  MatTreeModule,
  NgxSpinnerModule,
  SelectDropDownModule,
  DragDropModule,
  ScrollingModule
];

const COMPONENTS = [
  PasswordStrengthComponent,
  FixedPluginComponent,
  FooterComponent,
  NavbarComponent,
  SidebarComponent,
  TestScriptMenuComponent,
  ErrorComponent,
  CustomTextBoxComponent,
  StatusBarComponent,
  ComingSoonComponent,
  MultiValueChipComponent,
  AgGridActionCellRendererComponent,
  ScreenShotComponent,
  UnAuthorizedComponent,
  AddLocatorComponent,
  AddPagesComponent
];

const DIRECTIVES = [
  ExistingUsernameValidatorDirective,
  ExistingEmailValidatorDirective,
  ExistingOrganizationValidatorDirective,
  ExistingSubdomainValidatorDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    HttpClientModule,
    MATERIAL_COMPONENTS,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MATERIAL_COMPONENTS,
    COMPONENTS,
    DIRECTIVES,
    SlugPipe,
    SortByPipe,
    OrderPipe,
    RouterModule,
    MatMenuPreventDirective,

  ],
  declarations: [
    COMPONENTS,
    DIRECTIVES,
    SlugPipe,
    SortByPipe,
    OrderPipe,
    MatMenuPreventDirective,
    //AddLocatorComponent,
    //AddPagesComponent
  ],
  providers: [
    SlugPipe,
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer }
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
