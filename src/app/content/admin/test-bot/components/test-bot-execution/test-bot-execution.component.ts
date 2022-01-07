import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService, TestBotExecutorService } from "@app/core/services";
import { TestBot } from "@app/shared/models";

@Component({
  selector: "app-test-bot-execution",
  templateUrl: "./test-bot-execution.component.html",
})
export class TestBotExecutionComponent implements OnInit {
  testBot: TestBot;
  testBotExecutionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private testBotExecutorService: TestBotExecutorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TestBotExecutionComponent>,
    private notificationService: NotificationService
  ) {
    this.testBotExecutionForm = this.fb.group({
      name: ["", Validators.required],
    });

    if (data) {
      this.testBot = data.testBot;
    }
  }

  ngOnInit() {}

  onExecuteTestBotClick() {
    console.log(this.testBot);
    let executeTestBot = this.testBotExecutionForm.value;
    this.testBotExecutorService
      .runTestBot(this.testBot.testBotId, executeTestBot["name"])
      .subscribe((result) => {
        this.dialogRef.close(result["message"]);
        this.notificationService.showNotification(result["message"], '', 'top', 'right');
      });
  }
}
