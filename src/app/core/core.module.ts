import { SharedModule } from "@shared/shared.module";
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import {
  LocalStorageService,
  AuthService,
  RegisterService,
  TemplateService,
  ProjectService,
  OrganizationService,
  RoleService,
  CommonService,
  GlobalService,
  LocatorService,
  // PageService,
  UserService,
  TestReportService
} from "@core/services";

const SERVICES = [
  LocalStorageService,
  RegisterService,
  TemplateService,
  ProjectService,
  OrganizationService,
  RoleService,
  CommonService,
  GlobalService,
  LocatorService,
  // PageService, // Parth - No need to add if service is provided in core
  UserService,
  TestReportService
];
import { interceptorProviders } from "@core/interceptors";
import { DatesDiffPipe } from "./pipes/dates-diff.pipe";
import { TestbotFilterPipe } from "./pipes/testbot-filter.pipe";
import { TestSuiteFilterPipe } from "./pipes/test-suite-filter.pipe";

@NgModule({
  imports: [SharedModule],
  declarations: [DatesDiffPipe, TestbotFilterPipe, TestSuiteFilterPipe],
  exports: [DatesDiffPipe, TestbotFilterPipe, TestSuiteFilterPipe],
  providers: [SERVICES, ...interceptorProviders],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule {}
