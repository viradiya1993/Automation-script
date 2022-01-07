import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA
} from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from "@app/shared/shared.module";
import {
  AssignUserComponent,
  NonUserListComponent,
  ProjectFormComponent,
  ProjectListComponent,
  ProjectUserComponent,
  UserFormComponent,
  UsersListComponent,
  UserRoleComponent,
  AvailableUsersListComponent
} from "./components";
import { ProjectFilterComponent } from "./components/project-filter/project-filter.component";
import { ProjectUserService } from "./services/project-user.service";

const ProjectUserRoutes: Routes = [
  {
    path: "",
    component: ProjectUserComponent
  }
];

@NgModule({
  declarations: [
    ProjectUserComponent,
    ProjectListComponent,
    ProjectFormComponent,
    UserFormComponent,
    ProjectFilterComponent,
    NonUserListComponent,
    AssignUserComponent,
    UsersListComponent,
    UserRoleComponent,
    AvailableUsersListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    RouterModule.forChild(ProjectUserRoutes)
  ],
  exports: [RouterModule],
  providers: [ProjectUserService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ProjectUserModule {}
