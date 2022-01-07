import { TestScriptHandlerService } from './../../services/test-script-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestScriptExecutorService, TestScriptService } from '@app/core/services';
import { Status } from '@app/shared/enums';
import { Log, TestScript } from '@app/shared/models';

@Component({
  selector: "app-test-script-execution",
  templateUrl: "./test-script-execution.component.html",
  styleUrls: ["./test-script-execution.component.scss"],
})
export class TestScriptExecutionComponent implements OnInit {
  testScript: TestScript;
  logs: Log[] = [];
  inDebugMode = false;
  titles = [];
  showTab = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private testScriptService: TestScriptService,
    private testScriptExecutorService: TestScriptExecutorService,
    private testScriptHandler: TestScriptHandlerService
  ) {
    if (data) {
      this.testScript = data.testScript;
      this.getTitles(this.testScript.testScriptId);
    }
  }

  ngOnInit() {
    this.resetTestStepsStatus(Status.Pending);
  }

  private getTitles(testScriptId: string) {
    this.testScriptService.getTestScriptViewById(testScriptId).subscribe(testScriptView => {
      this.titles = [];
      if (testScriptView.epic) { this.titles.push(`${testScriptView.epic.name}`); }
      if (testScriptView.story) { this.titles.push(`${testScriptView.story.name}`); }
    });
  }

  showTabBody(name: string) {
    const tabNumber = this.showTab.findIndex((res) => res === name);
    if (tabNumber === -1) {
      this.showTab.push(name);
    } else {
      this.showTab.splice(tabNumber, 1);
    }
  }

  checkKey(name) {
    return this.showTab.findIndex((res) => res === name) !== -1;
  }
  checkStatus(id) {
    return this.logs.findIndex((res) => res.testStepId === id) !== -1;
  }

  onTestScriptRunClick() {
    this.resetTestStepsStatus(Status.Pending);
    console.log("onTestScriptRunClick");
    this.logs = [];
    this.testScriptExecutorService.run().subscribe();
    this.testScriptExecutorService.observeLogs().subscribe((log) => {
      if (!log.status) {
        this.logs.push(log);
      }

      this.testScript.testSteps.map((testStep) => {
        if (testStep.testStepId === log.testStepId) {
          testStep.status = log.status ? Status.Successful : Status.Failed;
        }
      });

      if (log.status === true) {
        this.setNextForExecution();
      }
    });
  }

  onTestScriptDebugClick() {
    this.resetTestStepsStatus(Status.Pending);
    console.log("onTestScriptDebugClick");
    this.inDebugMode = true;
    this.logs = [];
    this.setNextForExecution();
    this.testScriptExecutorService.debug().subscribe();
  }

  onTestScriptContinueClick(testStepId: string) {
    console.log("onTestScriptContinueClick");
    this.setNextForExecution();
    this.testScriptExecutorService.continue(testStepId).subscribe();
  }

  onTestScriptStepOverClick(testStepId: string = null) {
    console.log("onTestScriptStepOverClick");
    this.setNextForExecution();
    this.testScriptExecutorService.stepOver(testStepId).subscribe();
  }

  onTestScriptCancelClick() {
    // Todo - Stop the test script execution
  }

  toggleBreakpoint(testStepId: string, breakpoint: boolean) {
    console.log(testStepId + " - " + breakpoint);
    if (breakpoint) {
      this.testScriptExecutorService.enableBreakpoint(testStepId).subscribe();
    } else {
      this.testScriptExecutorService.disableBreakpoint(testStepId).subscribe();
    }
  }

  setClass(status: Status) {
    let className = "";
    switch (status) {
      case Status.Successful:
        className = "badge-success";
        break;
      case Status.Failed:
        className = "badge-danger";
        break;
      case Status.Executing:
        className = "badge-primary";
        break;
      case Status.Pending:
        className = "badge-default";
        break;
    }
    return className;
  }

  getStr(status: Status) {
    let str = "";
    switch (status) {
      case Status.Successful:
        str = "check_circle";
        break;
      case Status.Failed:
        str = "bug_report";
        break;
      case Status.Executing:
        str = "autorenew";
        break;
      case Status.Pending:
        str = "pending_actions";
        break;
    }
    return str;
  }

  showContinueButton(breakpoint: boolean, status: Status) {
    if (this.inDebugMode && breakpoint && status === Status.Pending) {
      return true;
    }
    return false;
  }

  setNextForExecution() {
    let index = -1;

    index = this.testScript.testSteps.findIndex((testStep) => {
      return testStep.status === Status.Pending;
    });

    if (
      index > -1 &&
      this.testScript.testSteps[index].status === Status.Pending
    ) {
      this.testScript.testSteps[index].status = Status.Executing;
    }
  }

  resetTestStepsStatus(status) {
    this.testScript.testSteps.map((testStep) => {
      testStep.status = status;
    });
  }

  onRestartClick() {
    this.testScriptExecutorService.logsRestart().subscribe(() => { });
  }

  public openEditTestScript() {
    this.testScriptHandler.openTestScriptEdit(this.testScript.testScriptId)
  }

}
