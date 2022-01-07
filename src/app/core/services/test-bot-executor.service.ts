import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration, ConsolidatedExecution, Execution, IterationResult, Log, TestScriptResult, TestSuiteResult } from '@app/shared/models';

import { Test_Bot_Executor_API, Test_Script_Executor_API } from '@core/helpers';
import { map } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";
import { Observable } from "rxjs";
// import { TestScriptResultP } from '@app/shared/models/test-script-resultp.model';


@Injectable({
  providedIn: 'root'
})
export class TestBotExecutorService {

  constructor(private http: HttpClient) {
  }

  runTestBot(testBotId: string, executionName: string) {
    let execution = {
      testBotId: testBotId,
      name: executionName,
      organizationId: localStorage.getItem('organizationId'),
      projectId: localStorage.getItem('projectId'),
      createdBy: JSON.parse(localStorage.getItem('user'))
    };
    return this.http.post(Test_Bot_Executor_API + "bots/" + testBotId + "/execute", execution).pipe(
      map(res => {
        return res as string;
      })
    );;
  }

  getConsolidatedExecutionsByTestBotId(testBotId: string, pageNumber = 0, pageSize = 10) {
    return this.http.get(`${Test_Bot_Executor_API}executions/bots/${testBotId}?offset=${pageNumber}&size=${pageSize}`)
      .pipe(
        map(res => {
          return {
            totalCount: res['totalElements'],
            data: res["content"] as ConsolidatedExecution[]
          };
        })
      );
  }
  /* Orignal */
  getTestSuiteResult(testSuiteResultId: string) {
    return this.http.get(`${Test_Bot_Executor_API}executions/testSuiteResults/${testSuiteResultId}`)
      .pipe(
        map(res => {
          return res as TestScriptResult[];
        })
      );
  }

  /* Duplicate With Pagination */
  getTestSuitPagination(testSuiteResultId: string, pageNumber = 0, pageSize = 10) {
    return this.http.get(`${Test_Bot_Executor_API}executions/testSuiteResults/${testSuiteResultId}?offset=${pageNumber}&size=${pageSize}`)
    .pipe(
      map(res => {
        return {
          totalCount: 0,
          data: res as TestScriptResult[]
        }
      })
    )
  }

  getConsolidatedExecutions(pageNumber = 0, pageSize = 10) {
    return this.http.get(`${Test_Bot_Executor_API}executions?offset=${pageNumber}&size=${pageSize}`)
      .pipe(
        map(res => {
          return {
            totalCount: res['totalElements'],
            data: res["content"] as ConsolidatedExecution[]
          };
        })
      );
  }

  getExecutions(pageNumber = 0, pageSize = 10) {
    return this.http.get(`${Test_Bot_Executor_API}executions?page=${pageNumber}&max=${pageSize}`)
      .pipe(
        map(res => {
          return {
            totalCount: res['totalElements'],
            data: res["content"] as Execution[]
          };
        })
      );
  }

  getExecution(executionId: string) {
    return this.http.get(`${Test_Bot_Executor_API}executions/${executionId}`)
      .pipe(
        map(result => {
          return result as TestSuiteResult[];
        })
      );
  }


  getConfiguration(testSuiteResultId: string) {
    return this.http.get(`${Test_Bot_Executor_API}executions/testSuiteResults/${testSuiteResultId}/configuration`)
      .pipe(
        map(res => {
          return res as Configuration;
        })
      );
  }

  getIterationResults(testScriptResultId: string) {
    return this.http.get(`${Test_Bot_Executor_API}executions/testScriptResults/${testScriptResultId}/iterations`)
      .pipe(
        map(res => {
          return res as IterationResult[];
        })
      );
  }

  getIterationResultById(testScriptResultId: string, iterationNumber: number) {
    return this.http.get(`${Test_Bot_Executor_API}executions/testScriptResults/${testScriptResultId}/iterations/${iterationNumber}`)
      .pipe(
        map(res => {
          return res as IterationResult;
        })
      );
  }

  getGridStatus(executionId: string, sessionId: string) {
    return this.http.get(`${Test_Bot_Executor_API}executions/${executionId}/agentStatus/${sessionId}`)
      .pipe(
        map(res => {
          return res as any;
        })
      );
  }
}
