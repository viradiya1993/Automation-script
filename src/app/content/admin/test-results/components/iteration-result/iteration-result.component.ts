import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ScreenShotComponent } from "@app/shared/components";
import {
  Configuration,
  IterationResult,
  TestScriptResult,
} from "@app/shared/models";
import * as Browser from "@shared/configs/browser";
import {TestBotExecutorService} from "@core/services";

@Component({
  selector: "app-iteration-result",
  templateUrl: "./iteration-result.component.html",
  styleUrls: ["./iteration-result.component.scss"],
})
export class IterationResultComponent implements OnInit {
  public iterationResult: IterationResult;
  public executionConfiguration: Configuration;
  public testScriptResult: TestScriptResult;
  public browsers: any = Browser;
  imagePath: String = null;
  imageTitle: String = null;
  gridStatus: string;
  gridMessage: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private testBotExecutorService: TestBotExecutorService
  ) {
    if (data) {
      this.iterationResult = data.iterationResult;
      this.executionConfiguration = data.executionConfiguration;
      this.testScriptResult = data.testScriptResult;
      this.gridStatus = data.gridStatus;
    }
  }

  previewImage(testScript) {
    this.imagePath = testScript.status.screenshotLink;
    this.imageTitle = testScript.testStepName;
  }

  removeImage() {
    this.imagePath = null;
    this.imageTitle = null;
  }

  showScreenShot(index: number) {
    const dialogRef = this.dialog.open(ScreenShotComponent, {
      panelClass: "test-step-result-screen-shot-dialog",
      minHeight: "100vh",
      minWidth: "59vw",
      maxWidth: "59vw",
      data: {
        title: this.iterationResult.testStepResults[index].status.message,
        screenShotLink:
          this.iterationResult.testStepResults[index].status.screenshotLink,
        details: "",
      },
      position: { right: "1" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog test step result screenshot: ${result}`);
    });
  }

  ngOnInit() {
    this.getGridStatus();
  }

  getGridStatus() {
    this.testBotExecutorService.getGridStatus(this.testScriptResult.testExecutionId, this.iterationResult.sessionId)
        .subscribe(response => {
          console.log('grid status' , response);
          this.gridStatus = response.gridStatus;
          this.gridMessage = response.gridMessage;
        })
  }
}
