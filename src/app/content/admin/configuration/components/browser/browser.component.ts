import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { BrowserFormComponent } from '../browser-form/browser-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Browser } from '@app/shared/models';
import { BrowserService } from '@app/core/services';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {
  dialogClosedEvent = new EventEmitter();
  constructor(public dialog: MatDialog, private browserService: BrowserService) {}
  openAddBrowserDialog() {
    const dialogRef = this.dialog.open(BrowserFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.dialogClosedEvent.emit();
    });
  }
  ngOnInit() {
  }

}
