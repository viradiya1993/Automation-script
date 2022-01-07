import { Component, OnInit } from "@angular/core";
import { TestBotService } from "@app/core/services";
import { TestBot } from "@app/shared/models";
import * as _ from "lodash";
import { TestBotFilterService } from "../../services/test-bot-filter.service";
import { SchedulerComponent } from "@app/content/admin/scheduler/components/scheduler/scheduler.component";
import { MatDialog } from "@angular/material/dialog";
import { TestBotExecutionComponent } from "../test-bot-execution/test-bot-execution.component";

declare const $: any;

@Component({
  selector: "app-test-bot-list",
  templateUrl: "./test-bot-list.component.html",
  styleUrls: ["./test-bot-list.component.scss"],
})
export class TestBotListComponent implements OnInit {
  testBots: TestBot[] = [];
  testBotToRemove: TestBot;

  constructor(
    private testBotService: TestBotService,
    private testBotFilterService: TestBotFilterService,
    public dialog: MatDialog
  ) {
    this.testBotService.getTestBots().subscribe((res) => {
      this.testBots = res.data;
    });
  }

  ngOnInit() {
    $("#removeTestBotConfirmation").on("hide.bs.modal", function () {
      this.testBotToRemove = undefined;
    });
  }

  selectedTestBot(testBot: TestBot) {
    this.testBotFilterService.appliedFilter.testBot = {
      testBotId: testBot.testBotId,
      name: testBot.name,
    };
    this.testBotFilterService.filter();
  }

  onTestBotSaveChange() {
    this.testBotService.getTestBots().subscribe((res) => {
      this.testBots = res.data;
    });
  }

  setTestBotToRemove(testBot: TestBot) {
    this.testBotToRemove = testBot;
  }

  openExecuteTestBotDialog(testBot: TestBot) {
    const dialogRef = this.dialog.open(TestBotExecutionComponent, {
      data: { testBot: testBot },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openScheduleTestBotDialog(testBot: TestBot) {
    const dialogRef = this.dialog.open(SchedulerComponent, {
      data: { testBot: testBot },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  removeTestBot(testBot: TestBot) {
    this.testBotService.removeTestBot(testBot.testBotId).subscribe(() => {
      this.testBots = _.reject(this.testBots, ["testBotId", testBot.testBotId]);
    });
  }
}
