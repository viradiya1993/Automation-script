import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from "@app/shared/shared.module";
import {
  MenuListComponent,
  SettingsComponent,
  GlobalParametersComponent,
  EnvironmentComponent,
  EnvironmentFormComponent,
  EnvironmentListComponent,
  BrowserComponent,
  BrowserFormComponent,
  BrowserListComponent,
  GridComponent,
  GridListComponent,
  GridFormComponent,
} from "./components/";
import { ConfigurationService } from "./services/configuration.service";

export const ConfigurationRoutes: Routes = [
  {
    path: "",
    component: SettingsComponent,
  },
];

@NgModule({
  declarations: [
    SettingsComponent,
    MenuListComponent,
    GlobalParametersComponent,
    EnvironmentComponent,
    EnvironmentFormComponent,
    EnvironmentListComponent,
    BrowserComponent,
    BrowserFormComponent,
    BrowserListComponent,
    GridComponent,
    GridFormComponent,
    GridListComponent,
  ],
  entryComponents: [
    GridFormComponent,
    EnvironmentFormComponent,
    BrowserFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule.forChild(ConfigurationRoutes),
  ],
  exports: [RouterModule],
  providers: [ConfigurationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ConfigurationModule {}
