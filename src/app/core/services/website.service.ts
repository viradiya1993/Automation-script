import { Injectable } from '@angular/core';
import { Website } from '@app/shared/models';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Website_API } from '@core/helpers';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  websiteApi: string = Website_API + 'websites';
  constructor(private http: HttpClient) { }

  getWebsites(offset: number) {
    return this.http.get(this.websiteApi + '/list').pipe(
      map(res => {
        return res as Website[];
      })
    );
  }

  addWebsite(website: Website) {
    website.organizationId = localStorage.getItem('organizationId');
    website.projectId = localStorage.getItem('projectId');
    return this.http.post(this.websiteApi, website).pipe();
  }

  updateWebsite(website: Website) {
    return this.http.put(this.websiteApi+ '/' + website.websiteId, website).pipe();
  }

  removeWebsiteById(websiteId: string) {
    return this.http.delete(this.websiteApi + '/' + websiteId).pipe();
  }
}
