import { TestScriptExecutorService } from "./../../../../../core/services/test-script-executor.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TestScriptService, WebsiteService } from "@app/core/services";
import { TestScript, Website } from "@app/shared/models";
import { Subscription } from "rxjs";

import { DialogService } from "../../services/dialog.service";
import { FilterService } from "../../services/filter.service";
import { TestScriptHandlerService } from "./../../services/test-script-handler.service";
import { environment } from "../../../../../../environments/environment";

@Component({
  templateUrl: "./test-script.component.html",
  styleUrls: ["./test-script.component.scss"],
})
export class TestScriptComponent implements OnInit, OnDestroy {
  groupBy: string;
  sortBy: string;
  showList = "stories";
  websites: Website[] = [];
  selectedProject: string = localStorage.getItem("projectId") || null;

  downloadAgentLink = environment.execution_link;
  agents = environment.agents;

  private subs = new Subscription();

  constructor(
    router: Router,
    private websiteService: WebsiteService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private testScriptService: TestScriptService,
    private testScriptExecutorService: TestScriptExecutorService,
    public filterService: FilterService,
    private testScriptHandler: TestScriptHandlerService
  ) {
    this.init(router);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private init(router) {
    const websiteSub = this.websiteService
      .getWebsites(0)
      .subscribe((websites) => {
        this.websites = websites;
      });
    this.subs.add(websiteSub);

    const openTestScriptEditSub =
      this.testScriptHandler.openTestScriptEditObs.subscribe(
        ({ testscriptId, closeAll }) => {
          this.openTestScriptDialogById(testscriptId);
          if (closeAll) {
            this.closeAll();
          }
        }
      );
    this.subs.add(openTestScriptEditSub);

    const openTestScriptExecutionSub =
      this.testScriptHandler.openTestScriptExecutionObs.subscribe(
        ({ testscriptId, closeAll }) => {
          this.openTestScriptExecutionDialogById(testscriptId);
          if (closeAll) {
            this.closeAll();
          }
        }
      );
    this.subs.add(openTestScriptExecutionSub);

    const extras = router.getCurrentNavigation()?.extras;
    if (extras?.state?.openTestScriptId) {
      this.testScriptHandler.openTestScriptEdit(extras.state.openTestScriptId);
      this.showList = "testScripts";
    }
    this.filterService.appliedFilter.showList = this.showList;
  }

  modelChangeShowList(e) {
    this.filterService.appliedFilter.showList = e;
  }

  openTestScriptDialog() {
    this.dialogService.openTestScriptDialog("add");
  }

  public openTestScriptDialogById(testScriptId: string) {
    this.testScriptService
      .getTestScriptById(testScriptId)
      .subscribe((res: TestScript) => {
        this.dialogService.openTestScriptDialog(
          "edit",
          res.storyId,
          testScriptId
        );
      });
  }

  public openTestScriptExecutionDialogById(testScriptId) {
    this.testScriptExecutorService.stage(testScriptId).subscribe((res) => {
      this.testScriptService
        .getTestScriptById(testScriptId)
        .subscribe((testScript) => {
          this.dialogService.openTestScriptExecutionDialog(testScript);
        });
    });
  }

  public closeAll() {
    this.dialog.closeAll();
  }
}
