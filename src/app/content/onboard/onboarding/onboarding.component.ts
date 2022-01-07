import { tap } from 'rxjs/operators';
import { UserService } from '@app/core/services';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '@app/core/services';
import { AuthService } from '@core/services/auth.service';

import { MessageService } from './../../../shared/components/message/messageService.service';
import { AssignableRole, IOnboardProjectInfo } from './../onboard.model';

@Component({
  selector: "app-onboarding-cmp",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})

export class OnBoardingComponent implements OnInit {

  public layoutProject = true;
  public layoutSubmit = false;
  public projectInfo: IOnboardProjectInfo;
  public assignableRole: AssignableRole[] = [];


  constructor(
    private router: Router, private messageService: MessageService, private authService: AuthService,
    private registerService: RegisterService, private userService: UserService
  ) { }

  ngOnInit() { }

  public onProjectInfoSubmit(projectInfo: IOnboardProjectInfo) {
    this.layoutProject = false;
    this.projectInfo = projectInfo;
  }

  public onAddUsersSubmit(roles: AssignableRole[]) {
    this.assignableRole = roles.filter(item => item.emailAddresses && item.emailAddresses.length);
    this.submit();
  }

  private submit() {
    const body = this.prepareBody();
    this.registerService.onboarding(body).subscribe(result => {
      if (result.status === 200) {
        this.layoutSubmit = true;
        this.setFirstTimeUser().subscribe();
      } else {
        this.messageService.showMessage({ type: 'error', title: '', body: result.message })
      };
    }, err => {
      console.error(err);
    })
  }

  private prepareBody() {
    return {
      name: this.projectInfo.name,
      description: this.projectInfo.description,
      emailAndRoles: this.assignableRole.map(item => ({ roleId: item.id, emails: item.emailAddresses })),
    }
  }

  private setFirstTimeUser() {
    const user = this.authService.user;
    return this.userService.firstTimeLogin(user.userId).pipe(tap((res) => {
      user.firstTimeLogin = false;
      this.authService.user = user;
    }));
  }

  public skipToDashboard() {
    this.setFirstTimeUser().subscribe(() => {
      this.goToDashboard();
    });
  }

  public goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
