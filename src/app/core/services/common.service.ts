import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DASHBOARD_API } from "@core/helpers/api.helper";
import { Menu } from "@shared/models/menu.model";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  public notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();
  public logo = "";
  public onImageChange = new Subject<any>();
  dashboardApi: string = DASHBOARD_API;

  menuLists: Menu[] = [];
  menuUserId = null;

  constructor(private http: HttpClient) {}

  getCurrencyList(): Observable<any> {
    const url = "../../../../assets/data/country.json";
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getMenu(): Observable<any> {
    let userData = JSON.parse(localStorage.getItem("user"));

    let userInfoID = userData.userId ? userData.userId : userData.id;

    // if (this.menuLists.length > 0 && this.menuUserId == userInfoID) {
    //   const menuObservable = new Observable((res) => {
    //     res.next(this.menuLists);
    //   });
    //   return menuObservable;
    // }

    this.menuUserId = userInfoID;
    return this.http.get(this.dashboardApi + "dashboard/" + userInfoID).pipe(
      map((res: any) => {
        this.menuLists = res;
        return res;
      })
    );
  }

  upLoadImage(file, fileId): Observable<any> {
    // const url = (environment.api_url. $environment.url + 'Attachment/addProfilePicture/');
    // return this.http.post(url, JSON.stringify(file));
    return;
  }

  notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  isAuthorized(url: string, userId: string) {
    return this.http.post(this.dashboardApi + `dashboard/${userId}`, {
      "url": url
    }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
