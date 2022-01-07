import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { BrowserFormComponent } from '../browser-form/browser-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Browser } from '@app/shared/models';
import { BrowserService } from '@app/core/services';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

declare const $: any;

@Component({
  selector: 'app-browser-list',
  templateUrl: './browser-list.component.html',
  styleUrls: ['./browser-list.component.scss']
})
export class BrowserListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["name", "value", "createdBy", "updatedBy", "actions"];
  browsers: Browser[] = [];
  browserToRemove: Browser;
  resultsLength = 0;
  isRateLimitReached = false;

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
    $("#removeBrowserConfirmation").on('hide.bs.modal', function () {
      this.browserToRemove = undefined;
    });
   }
  
  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.dialogClosedEvent)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.browserService.getBrowsers(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(res => {
          this.isRateLimitReached = false;
          this.resultsLength = res.totalCount;
          return res.data;
        }),
        catchError(() => {
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.browsers = data);
  }

  setBrowserToRemove(browser: Browser) {
    this.browserToRemove = browser;
  }

  removeBrowser(browser: Browser){
    this.browserService.removeBrowser(browser.browserId).subscribe(() => {
      this.dialogClosedEvent.emit();
    });
  }

  editBrowser(browser: Browser){
    const dialogRef = this.dialog.open(BrowserFormComponent, {data: { 'browser': browser } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.dialogClosedEvent.emit();
    });
  }
}
