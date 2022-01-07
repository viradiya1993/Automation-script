import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { EpicService, NotificationService, StoryService } from '@app/core/services';
import { Epic, Story } from '@app/shared/models';
import { of } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-story-form',
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.scss']
})
export class StoryFormComponent implements OnInit, AfterViewInit {

  @ViewChild('storyFormMatTrigger') storyFormMatTrigger: MatMenuTrigger;
  @Input() linkBtn: boolean = false;
  @Input() editIconBtn: boolean = false;

  @Input() story: Story = undefined;
  storyForm: FormGroup;
  epics: Epic[] = [];
  searchEpicsCtrl = new FormControl('', [Validators.required]);
  isLoading = false;

  constructor(private fb: FormBuilder, private storyService: StoryService, private epicService: EpicService,
    private notificationService: NotificationService, public filterService: FilterService) {
    this.storyForm = this.fb.group({
      epicId: ['', Validators.required],
      name: ['', Validators.required],
      summary: ['']
    });
  }

  setStoryForEdit() {
    if (this.story) {
      this.storyForm.patchValue(this.story);
    }
  }

  ngOnInit() {
    this.searchEpicsCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.epics = [];
        }),
        switchMap(filterValue => {
          if (typeof filterValue === "string" && filterValue.length > 0) {
            this.isLoading = true;
            return this.epicService.getEpics(filterValue)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              );
          } else {
            return of(null);
          }
        })
      )
      .subscribe(res => {
        if (!res) {
          this.epics = [];
        } else {
          this.epics = res['data'];
        }

        console.log(this.epics);
      });
  }

  getSelectedEpic(epic: Epic) {
    this.storyForm.patchValue({ 'epicId': epic.epicId });
  }

  ngAfterViewInit(): void {
    this.storyFormMatTrigger.menuOpened.subscribe(() => {
      if (this.filterService.appliedFilter.epic) {
        this.storyForm.patchValue({ 'epicId': this.filterService.appliedFilter.epic.epicId });
      }
    });
  }

  public displayFn(epic: Epic): string {
    return epic?.name || '';
  }

  onStoryCancelClick() {
    this.reset();
    this.storyFormMatTrigger.closeMenu();
    this.isLoading = false;
  }

  onStorySaveClick() {
    this.story = { ...this.story, ...this.storyForm.value };
    console.log(this.story);
    if (this.story.storyId) {
      this.storyService.updateStory(this.story).subscribe(() => {
        this.savePostActions(false);
      });
    } else {
      this.storyService.addStory(this.story).subscribe((result) => {
        this.savePostActions(true);
      });
    }
  }

  savePostActions(isCreated: Boolean) {
    this.reset();
    this.notificationService.showNotification(`Story ${isCreated ? 'created' : 'updated'} successfully`, '', 'top', 'right');
    this.storyFormMatTrigger.closeMenu();
    this.filterService.filter();
  }

  reset() {
    this.storyForm.reset();
    this.searchEpicsCtrl.setValue('');
  }

}
