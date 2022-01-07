import { LandingPageComponent } from "./landing-page/landing-page.component";
import { UserInformationComponent } from "./client/user-information/user-information.component";
import { ClientComponent } from "./client/client.component";
import { ClientDetailComponent } from "./client/client-details/client-details.component";
import { SearchApiComponent } from "./search-api/search-api.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AuthGuard } from "@core/guards";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TestScriptComponent } from "./test-script/components";
import { ProjectInformationComponent } from "./client/project-information/project-information.component";
import { TestSuiteComponent } from "./test-suite/components/test-suite/test-suite.component";
import { TestBotComponent } from "./test-bot/components/test-bot/test-bot.component";
import { ComingSoonComponent } from "./coming-soon/coming-soon.component";
import { TestResultsComponent } from "./test-results/components/test-results/test-results.component";
import { ErrorComponent, UnAuthorizedComponent } from "@app/shared/components";
import { ReleaseComponent } from "./release/components/release/release.component";
import { UserScriptComponent } from "./user-script/components";
import { LicenseTypesComponent } from "./license-types/components";
import { UpgradePlanComponent } from "./upgrade-plan/components";

export const AdminRoutes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "operational-dashboard",
        pathMatch: "full",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "search-api",
        component: SearchApiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "object-repository",
        loadChildren: () =>
          import("./object-repository-v2/object-repository-v2.module").then(
            (objectRepositoryV2) => objectRepositoryV2.ObjectRepositoryV2Module
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "test-script",
        component: TestScriptComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "user-scripts",
        component: UserScriptComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "test-suite",
        component: TestSuiteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "test-bot",
        component: TestBotComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "license-types",
        component: LicenseTypesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "upgrade-plan",
        component: UpgradePlanComponent,
        //canActivate: [AuthGuard],
      },
      // {
      //   path: "global-parameters",
      //   component: GlobalParametersComponent,
      // },
      // {
      //   path: "environments",
      //   component: EnvironmentComponent,
      // },
      // {
      //   path: "browsers",
      //   component: BrowserComponent,
      // },
      // {
      //   path: "grids",
      //   component: GridComponent,
      // },
      {
        path: "clients",
        component: ClientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "clients/:id/detail",
        component: ClientDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "projects",
        component: ProjectInformationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "users",
        component: UserInformationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "dashboard",
        component: LandingPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "coming-soon",
        component: ComingSoonComponent,
      },
      {
        path: "404",
        component: ErrorComponent,
      },
      {
        path: "forbidden",
        component: UnAuthorizedComponent,
      },
      {
        path: "test-results",
        component: TestResultsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "releases",
        component: ReleaseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "user-defined-tests",
        component: ComingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "strategic-dashboard",
        component: ComingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "dashboard-parameters",
        component: ComingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "integrations",
        component: ComingSoonComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "projects-and-users",
        loadChildren: () =>
          import("./project-user/project-user.module").then(
            (projectUser) => projectUser.ProjectUserModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./configuration/configuration.module").then(
            (configuration) => configuration.ConfigurationModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
