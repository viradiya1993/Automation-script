import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TestSuiteView } from '@app/shared/models';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  name: string = "";
  testSuiteViews: TestSuiteView[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteDialogComponent>) {
    if (data) {
      this.name = data.name || this.name;
      this.testSuiteViews = data.testSuiteViews || this.testSuiteViews
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
