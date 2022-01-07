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
  ObjectRepositoryV2Component,
  PageFormComponent,
  DeleteLocatorDialogComponent,
  WebsiteFormComponent,
  WebsiteListComponent,
  FilterComponent
} from "./components";
import { ObjectRepositoryV2Service } from "./services/object-repository-v2.service";

const ObjectRepositoryV2Routes: Routes = [
  {
    path: "",
    component: ObjectRepositoryV2Component,
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule.forChild(ObjectRepositoryV2Routes),
  ],
  exports: [RouterModule],
  declarations: [
    ObjectRepositoryV2Component,
    PageFormComponent,
    DeleteLocatorDialogComponent,
    WebsiteListComponent,
    WebsiteFormComponent,
    FilterComponent
  ],
  providers: [ObjectRepositoryV2Service],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ObjectRepositoryV2Module {}
