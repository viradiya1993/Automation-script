import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TestSuite, TestScriptView, TestBotView } from '@app/shared/models';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Test_Suite_API } from '@core/helpers';

@Injectable({
  providedIn: 'root'
})
export class TestSuiteService {

  testSuites: TestSuite[] = [];

  test_Suite_api = Test_Suite_API + 'suites';

  constructor(private http: HttpClient) {
  }

  getTestSuites(sortColumn = 'name', sortOrder = 'asc', pageNumber = -1, pageSize = -1) {
    return this.http.get(`${this.test_Suite_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`)
      .pipe(
        map(res => {
          return {
            totalCount: res['totalElements'],
            data: res["content"] as TestSuite[]
          };
        })
      );
  }

  getTestScripts(sortColumn = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get(`${this.test_Suite_api}/view/scripts?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`).pipe(
      map(res => {
        return {
          totalCount: res['totalElements'],
          data: res["content"] as TestScriptView[]
        };
      })
    );
  }

  addTestSuite(testSuite: TestSuite) {
    testSuite.organizationId = localStorage.getItem('organizationId');
    testSuite.projectId = localStorage.getItem('projectId');
    return this.http.post(this.test_Suite_api, testSuite).pipe();
  }

  updateTestSuite(testSuite: TestSuite) {
    return this.http.put(`${this.test_Suite_api}/${testSuite.testSuiteId}`, testSuite).pipe();
  }

  removeTestSuite(testSuiteId: string) {
    return this.http.delete(`${this.test_Suite_api}/${testSuiteId}`).pipe();
  }

  checkTestSuiteExist(testSuiteId: string) {
    return this.http.get<TestBotView[]>(`${this.test_Suite_api}/${testSuiteId}/isAddedToTestBots`).pipe();
  }

}
