import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { Observable } from "rxjs";
import { CommonService } from "../services";

import { SUBSCRIBER } from "./../../shared/configs/roles";
import { Role } from "./../../shared/models/role.model";
import { UserInfoModel } from "./../../shared/models/user-info.model";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  isAuthorized: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve, reject) => {
      const userInfo: UserInfoModel = JSON.parse(localStorage.getItem("user"));
      if (userInfo && userInfo.userId) {
        this.commonService
          .isAuthorized(state.url, userInfo.userId)
          .subscribe((res: any) => {
            const isAuthorized = res.authorized;
            if (this.authService.isAuthenticated()) {
              if (isAuthorized) {
                if (this.isOnBoardingPending()) {
                  this.router.navigate(["/onboard"]);
                  resolve(true);
                } else {
                  // logged in so return true
                  resolve(true);
                }
              } else {
                this.router.navigate(["/dashboard"], {});
                resolve(true);
              }
            } else {
              // not logged in so redirect to login page with the return url
              this.router.navigate(["auth/login"], {
                queryParams: { returnUrl: encodeURIComponent(state.url) },
              });
              reject(false);
            }
          });
      } else {
        this.router.navigate(["auth/login"], {
          queryParams: { returnUrl: encodeURIComponent(state.url) },
        });
        reject(false);
      }
    });
  }

  public isOnBoardingPending(): boolean {
    const userInfo: UserInfoModel = JSON.parse(localStorage.getItem("user"));
    const userRole: Role = JSON.parse(localStorage.getItem("user-role"));

    return (
      this.authService.isAuthenticated() &&
      userInfo?.firstTimeLogin &&
      userRole?.roleId === SUBSCRIBER
    );
  }
}
