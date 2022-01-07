import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { AuthService } from "@core/services/auth.service";
import { Router } from "@angular/router";
import {
  ACCESS_TOKEN,
  ORGANIZATION_ID,
  PROJECT_ID,
  HEADER_ORGANIZATION_ID,
  CLIENT_ID,
  USER_PASSWORD,
  CONFIRM_PASSWORD_TOKEN,
} from "@app/shared/configs";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(public auth: AuthService, public router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if (!request.headers.has("Content-Type")) {
    //   request = request.clone({
    //     headers: request.headers.set("Content-Type", "application/json"),
    //   });
    // }

    // request = request.clone({
    //   headers: request.headers.set("Accept", "application/json"),
    // });

    // if (!request.headers.has("Access-Control-Allow-Origin")) {
    //   request = request.clone({
    //     headers: request.headers.set("Access-Control-Allow-Origin", "*"),
    //   });
    // }

    if (localStorage.getItem(CONFIRM_PASSWORD_TOKEN)) {
      const password = localStorage.getItem(USER_PASSWORD);
      if (password) {
        request = request.clone({
          headers: request.headers.set(USER_PASSWORD, password),
        });
      }
    }

    if (this.auth.isAuthenticated()) {
      request = request.clone({
        headers: request.headers.set(
          "Authorization",
          localStorage.getItem(ACCESS_TOKEN)
        ),
      });

      let org = localStorage.getItem(ORGANIZATION_ID);
      let projectId = localStorage.getItem(PROJECT_ID);

      if (localStorage.getItem(CLIENT_ID)) {
        org = localStorage.getItem(CLIENT_ID);
      }

      if (org) {
        request = request.clone({
          headers: request.headers.set(HEADER_ORGANIZATION_ID, org),
        });
      }

      if (projectId) {
        request = request.clone({
          headers: request.headers.set(PROJECT_ID, projectId),
        });
      } else {
        request = request.clone({
          headers: request.headers.set(PROJECT_ID, "all"),
        });
      }
    }

    return next.handle(request);
  }
}
