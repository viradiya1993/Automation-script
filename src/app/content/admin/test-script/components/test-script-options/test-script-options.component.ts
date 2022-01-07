import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalParametersService, TemplateService, WebsiteService } from '@app/core/services';
import { DialogService } from '../../services/dialog.service';
import { EpicFormComponent } from '../epic-form/epic-form.component';
import { StoryFormComponent } from '../story-form/story-form.component';
import { TestScriptFormComponent } from '../test-script-form/test-script-form.component';

@Component({
  selector: 'app-test-script-options',
  templateUrl: './test-script-options.component.html',
  styleUrls: ['./test-script-options.component.scss']
})
export class TestScriptOptionsComponent implements OnInit {

  groupBy: string = "1";
  sortBy: string;

  @Output() onGroupByChanged = new EventEmitter<string>();
  @Output() onSortByChanged = new EventEmitter<string>();

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
    this.onGroupByChange();
    this.onSortByChange();
  }

  openEpicDialog() {
    this.dialogService.openEpicDialog();
  }

  openStoryDialog() {
    this.dialogService.openStoryDialog();
  }

  openTestScriptDialog() {
    this.dialogService.openTestScriptDialog('add');
  }

  onGroupByChange(){
    this.onGroupByChanged.emit(this.groupBy);
  }

  onSortByChange(){
    this.onSortByChanged.emit(this.sortBy);
  }
}
