import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterService } from '@app/core/services';
import { interceptorProviders } from '@core/interceptors';
import { RoleService } from '@core/services';
import { debounceTime } from 'rxjs/operators';

import { SharedModule } from './../../shared/shared.module';
import { OnBoardLayoutComponent } from './layout/onboard-layout.component';
import { AddProjectComponent } from './onboarding/add-project/add-project.component';
import { AddUsersComponent } from './onboarding/add-users/add-users.component';
import { OnBoardingComponent } from './onboarding/onboarding.component';

const OnBoardRoutes: Routes = [
  {
    path: "",
    component: OnBoardLayoutComponent,
    children: [
      {
        path: "",
        component: OnBoardingComponent
      }
    ],
  },
];

@NgModule({
  declarations: [OnBoardLayoutComponent, OnBoardingComponent, AddProjectComponent, AddUsersComponent],
  providers: [...interceptorProviders, RoleService, RegisterService],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(OnBoardRoutes),
  ]
})
export class OnboardModule {
  debounceTime
}
