import { catchError, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { REGISTER_API } from "@core/helpers/";
import {
  HttpClient,
  HttpResponse,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { RegistrationObj } from "@app/shared/models";

@Injectable()
export class RegisterService {
  registerApi: string = REGISTER_API;

  constructor(private http: HttpClient) {}

  validateEmail(email: any): Observable<any> {
    return this.http.get(this.registerApi + "checkEmailAvailability", {
      params: new HttpParams().set("email", email.toString()),
    });
  }

  validateUserName(user: any): Observable<any> {
    return this.http.get(this.registerApi + "checkUserNameAvailability", {
      params: new HttpParams().set("username", user.toString()),
    });
  }

  show(username: string): Observable<any> {
    return this.http.get(this.registerApi + username + "/info").pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(this.registerApi + "register", data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  forgotPassword(data: any): Observable<any> {
    return this.http
      .post(this.registerApi + "forgot", { email: data.toString() })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  confirm(token: string): Observable<any> {
    return this.http.get(this.registerApi + "confirm?token=" + token).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  setPassword(password: string, data: object = {}): Observable<any> {
    const token = localStorage.getItem("tokenPassword");
    const forgotPassword = localStorage.getItem("tokenForgotPassword");
    const invite = localStorage.getItem("invited");
    let passwordUrl = "confirm?token=" + token;

    if (invite) {
      passwordUrl = "confirm/invitedUser?token=" + token;
    }

    if (!!forgotPassword) {
      passwordUrl = passwordUrl + "&forgotPassword=" + forgotPassword;
    }

    return this.http
      .post(
        this.registerApi + passwordUrl,
        { ...data },
        {
          headers: new HttpHeaders().set("password", password.toString()),
        }
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  multipleUser(objects: any): Observable<any> {
    return this.http.post(this.registerApi + "register/multiple", objects).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  onboarding(data: any): Observable<any> {
    return this.http.post(this.registerApi + "onboarding", data);
  }

  validateAccessCode(accessCode: string) {
    return this.http.get<RegistrationObj>(
      `${this.registerApi}register/code/${accessCode}`
    );
  }

  resendInvite(email: string): Observable<any> {
    return this.http
      .post(this.registerApi + "resend", { email: email })
      .pipe(map((res) => res));
  }
}
