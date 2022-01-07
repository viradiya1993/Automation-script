import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { EnvironmentFormComponent } from '../environment-form/environment-form.component';
import { MatDialog } from '@angular/material/dialog';
import { EnvironmentService } from '@app/core/services';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent implements OnInit {
  dialogClosedEvent = new EventEmitter();
  constructor(public dialog: MatDialog, private environmentService: EnvironmentService) { }
  openAddEnvironmentDialog() {
    const dialogRef = this.dialog.open(EnvironmentFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.dialogClosedEvent.emit();
    });
  }
  ngOnInit() {
  }

}
