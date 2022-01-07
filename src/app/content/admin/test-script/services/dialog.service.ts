import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  GlobalParametersService,
  TemplateService,
  TestScriptService,
  WebsiteService,
} from "@app/core/services";
import { TestScript } from "@app/shared/models";
import { EpicFormComponent } from "../components/epic-form/epic-form.component";
import { StoryFormComponent } from "../components/story-form/story-form.component";
import { TestScriptExecutionComponent } from "../components/test-script-execution/test-script-execution.component";
import { TestScriptFormComponent } from "../components/test-script-form/test-script-form.component";
import { DeleteDialogComponent } from "../components/delete-dialog/delete-dialog.component";
import { FilterService } from "./filter.service";

@Injectable()
export class DialogService {
  constructor(
    public dialog: MatDialog,
    private templateService: TemplateService,
    private websiteService: WebsiteService,
    private globalParametersService: GlobalParametersService,
    private testScriptService: TestScriptService,
    private filterService: FilterService
  ) { }

  openEpicDialog() {
    const dialogRef = this.dialog.open(EpicFormComponent, {
      panelClass: "epic-form-dialog",
      minHeight: "100vh",
      minWidth: "75vw",
      position: { right: "1" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openStoryDialog() {
    const dialogRef = this.dialog.open(StoryFormComponent, {
      panelClass: "story-form-dialog",
      minHeight: "100vh",
      minWidth: "75vw",
      position: { right: "1" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openTestScriptDialog(mode: string, storyId?: string, testScriptId?: string) {
    this.templateService.getTemplatesByTitle("").subscribe((templatesRes) => {
      this.websiteService.getWebsites(0).subscribe((websites) => {
        this.globalParametersService
          .getGlobalParametersByName("config.")
          .subscribe((globalParameters) => {
            const dialogRef = this.dialog.open(TestScriptFormComponent, {
              panelClass: "test-script-form-dialog",
              minHeight: "100vh",
              minWidth: "85vw",
              maxWidth: "85vw",
              position: { right: "1" },
              data: {
                mode: mode,
                storyId: storyId,
                testScriptId: testScriptId,
                templates: templatesRes,
                websites: websites,
                globalParameters: globalParameters,
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
            });
          });
      });
    });
  }

  openTestScriptExecutionDialog(testScript: TestScript) {
    const dialogRef = this.dialog.open(TestScriptExecutionComponent, {
      panelClass: "test-script-execution-dialog",
      minHeight: "100vh",
      minWidth: "75vw",
      position: { right: "1" },
      hasBackdrop: true,
      disableClose: true,
      data: { testScript: testScript },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEpicDeleteDialog(epicId: string, name: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        name: name,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.testScriptService.removeTestScript(epicId).subscribe(() => {
          this.filterService.filter();
        });
      }
    });
  }

  openStoryDeleteDialog(storyId: string, name: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        name: name,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.testScriptService.removeTestScript(storyId).subscribe(() => {
          this.filterService.filter();
        });
      }
    });
  }

  openTestScriptDeleteDialog(testScriptId: string, name: string) {
    this.testScriptService.checkTestScriptExist(testScriptId).subscribe((testSuiteViews) => {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        panelClass: "deleteModal-dialog",
        data: {
          name: name,
          testSuiteViews: testSuiteViews
        },
      });
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.testScriptService.removeTestScript(testScriptId).subscribe(() => {
            this.filterService.filter();
          });
        }
      });
    });
  }
}
