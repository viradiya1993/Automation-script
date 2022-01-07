import { LocatorTestScripts } from './../../shared/models/locator.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Locator, Page, Project } from '@shared/models';
import { map } from 'rxjs/operators';

import { PAGE_API } from './../helpers/api.helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  // tslint:disable-next-line:no-inferrable-types
  baseUrl: string = PAGE_API + 'projects/' + localStorage.getItem('projectId') + '/pages/';
  project: Project;

  constructor(private http: HttpClient) { }

  getProject() {
    return this.http.get(this.baseUrl)
      .pipe(
        map(project => {
          this.project = project as Project;
          return this.project;
        })
      );
  }

  getPages() {
    return this.http.get(this.baseUrl + 'list')
      .pipe(
        map(project => {
          this.project = project as Project;

          this.project.pages.forEach(page => {
            page.locators.forEach(locator => {
              locator.pageId = page.pageId;
            });
          })

          return this.project.pages;
        })
      );
  }

  getPageById(pageId: string) {
    return this.http.get(this.baseUrl + pageId).pipe(
      map(page => {
        return page as Page;
      })
    );
  }

  deletePageById(pageId: string) {
    return this.http.delete(this.baseUrl + pageId).pipe();
  }

  updatePage(page: Page) {
    return this.http.put(this.baseUrl + page.pageId, page).pipe();
  }

  getLocatorsByPageId(pageId: string) {
    return this.http.get(this.baseUrl + pageId + '/locators?offset=0')
      .pipe(
        map(res => {
          return res['content'] as Locator[];
        })
      );
  }

  addPage(page: Page) {
    return this.http.post(PAGE_API + 'websites/' + page.websiteId + '/pages', page).pipe();
  }
 
  //new
  addPages(data: any, websiteId: string) {
    return this.http.post(PAGE_API + 'websites/' + websiteId + '/pages/', data).pipe();
  }
  //new
  addLocatore(data: any, websiteId: string, pageId: string) {
    return this.http.put(PAGE_API + 'websites/' + websiteId + '/pages/' + pageId + '/locator', data) 
  }

  updatePageById(page: Page) {
    return this.http.put(PAGE_API + 'websites/' + page.websiteId + '/pages/' + page.pageId, page).pipe();
  }

  removePageById(websiteId: string, pageId: string) {
    return this.http.delete(PAGE_API + 'websites/' + websiteId + '/pages/' + pageId).pipe();
  }

  getPagesByWebsiteId(websiteId: string) {
    return this.http.get(PAGE_API + 'websites/' + websiteId + '/pages/list')
      .pipe(
        map(res => {
          return res['pages'] as Page[];
        })
      );
  }

  getPageByWebsiteIdAndPageId(websiteId: string, pageId: string) {
    return this.http.get(PAGE_API + 'websites/' + websiteId + '/pages/' + pageId).pipe(
      map(page => {
        return page as Page;
      })
    );
  }

  public getTestScriptsForLocator(websiteId: string, pageId: string, locatorId: string): Observable<LocatorTestScripts> {
    const url = PAGE_API + `websites/${websiteId}/pages/${pageId}/getTestScriptsForLocator/${locatorId}`;
    return this.http.get(url) as Observable<LocatorTestScripts>;
  }

}
