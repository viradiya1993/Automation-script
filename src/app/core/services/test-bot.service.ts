import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ReleaseView, TestBot, TestSuiteView } from "@app/shared/models";
import { catchError, map } from "rxjs/operators";
import * as _ from "lodash";
import { Test_Bot_API } from "@core/helpers";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TestBotService {
  testBots: TestBot[] = [];

  test_Bot_api = Test_Bot_API + "testbots";

  constructor(private http: HttpClient) {}

  getTestBot(testBotId: string) {
    return this.http.get<TestBot>(`${this.test_Bot_api}/${testBotId}`).pipe();
  }

  getTestBots(
    sortColumn = "name",
    sortOrder = "asc",
    pageNumber = -1,
    pageSize = -1
  ) {
    return this.http
      .get(
        `${this.test_Bot_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`
      )
      .pipe(
        map(res => {
          return {
            totalCount: res["totalElements"],
            data: res["content"] as TestBot[]
          };
        })
      );
  }

  getTestSuites(
    sortColumn = "name",
    sortOrder = "asc",
    pageNumber = 0,
    pageSize = 10
  ) {
    return this.http
      .get(
        `${this.test_Bot_api}/view/scripts?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`
      )
      .pipe(
        map(res => {
          return {
            totalCount: res["totalElements"],
            data: res["content"] as TestSuiteView[]
          };
        })
      );
  }

  addTestBot(testBot: TestBot) {
    testBot.organizationId = localStorage.getItem("organizationId");
    testBot.projectId = localStorage.getItem("projectId");
    testBot.createdBy = JSON.parse(localStorage.getItem("user"));
    return this.http.post(this.test_Bot_api, testBot).pipe(
      catchError(err => {
        return of({ testBotId: "" });
      })
    );
  }

  updateTestBot(testBot: TestBot) {
    testBot.updatedBy = JSON.parse(localStorage.getItem("user"));
    return this.http
      .put(`${this.test_Bot_api}/${testBot.testBotId}`, testBot)
      .pipe();
  }

  removeTestBot(testBotId: string) {
    return this.http.delete(`${this.test_Bot_api}/${testBotId}`).pipe();
  }

  checkTestBotExist(testBotId: string) {
    return this.http
      .get<ReleaseView[]>(`${this.test_Bot_api}/${testBotId}/isAddedToReleases`)
      .pipe();
  }
}
