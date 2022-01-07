import { Component } from '@angular/core';
import { SchedulerService } from '@app/core/services';
import { Scheduler } from '@app/shared/models';
import { SchedulerDialogService } from "../../services/scheduler-dialog.service";

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {

  constructor(private dialogService: SchedulerDialogService, private schedulerService: SchedulerService) {}
  
  openSchedulerDialog() {
    let scheduler: Scheduler = {
      organizationId: '',
      projectId: '',
      resourceId: this.schedulerService.appliedFilter.resourceId,
      resourceType: this.schedulerService.appliedFilter.resourceType,
      schedulerId: '',
      name: '',
      recurringRule: '',
      emails: [],
      active: true
    }
    
    this.dialogService.openSchedulerDialog(scheduler);
  }
}
