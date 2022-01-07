import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchedulerService } from '@app/core/services';
import { Scheduler } from '@app/shared/models';
import * as _ from "lodash";
import { CronOptions } from 'ngx-cron-editor';

@Component({
  selector: 'app-scheduler-form',
  templateUrl: './scheduler-form.component.html',
  styleUrls: ['./scheduler-form.component.scss']
})
export class SchedulerFormComponent implements OnInit {
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  schedulerForm: FormGroup;
  scheduler: Scheduler;
  public separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  public cronOptions: CronOptions = {
    defaultTime: "00:00:00",

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSpecificWeekDayTab: false,
    hideSpecificMonthWeekTab: false,

    use24HourTime: true,
    hideSeconds: false,

    cronFlavor: "standard" //standard or quartz
  };

  constructor(private fb: FormBuilder, private schedulerService: SchedulerService, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.scheduler = data.scheduler;
    }
  }

 
  ngOnInit(): void {
    this.schedulerForm = this.fb.group({
      name: ['', Validators.required],
      emails: new FormControl([], [this.requiredArrayValidator(), this.emailArrayValidator(), this.patternValidator()]),
      recurringRule: ['', Validators.required],//new FormControl(this.scheduler.recurringRule, Validators.required), //
      active: [true],
      resourceId: null,
      resourceType: null
    });

    this.schedulerForm.patchValue(this.scheduler);
  }

  paste(event: ClipboardEvent): void {
    const formControl: AbstractControl = this.schedulerForm.get('emails');
    event.preventDefault();
    event.clipboardData
      .getData('Text')
      .split(/;|,|\n/)
      .forEach(value => {
        if (value.trim()) {
          if (value && _.isArray(formControl.value)
            && [...formControl.value].findIndex((val) => val === value) === -1, { invalid: false }) {
            formControl.setValue([...formControl.value, value]);
          }
        }
      })
  }

  public addEmailAddress(event: MatChipInputEvent): void {
    const formControl: AbstractControl = this.schedulerForm.get('emails');
    const input: HTMLInputElement = event.input;
    const value: string = (event.value || '').trim();
    if (value && _.isArray(formControl.value) && [...formControl.value].findIndex((val) => val === value) === -1) {
      formControl.setValue([...formControl.value, value]);
    }
    formControl.updateValueAndValidity();

    if (input) {
      input.value = '';
    }
  }

  public removeEmailAddress(selectedEmail: string): void {
    const formControl: AbstractControl = this.schedulerForm.get('emails');
    const value: string[] = formControl.value.filter(
      (email: string) => email !== selectedEmail
    );
    formControl.setValue(value);
    formControl.updateValueAndValidity();
  }

  onSchedulerSaveClick() {
    this.scheduler = { ...this.scheduler, ...this.schedulerForm.getRawValue() };
    if (this.scheduler.schedulerId) {
      this.schedulerService.updateScheduler(this.scheduler).subscribe(() => {
        this.resetSchedulerForm();
        this.schedulerService.filter();
      });
    } else {
      this.schedulerService.addScheduler(this.scheduler).subscribe(() => {
        this.resetSchedulerForm();
        this.schedulerService.filter();
      });
    }
  }

  onSchedulerCancelClick() {
    console.log("onSchedulerCancelClick");
  }

  resetSchedulerForm() {
    this.schedulerForm.reset();
    this.schedulerForm.setControl('emails', new FormControl([], [this.requiredArrayValidator(), this.emailArrayValidator()]));
    this.scheduler = undefined;
  }

  emailArrayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let isPassed: boolean = true;
      if (Array.isArray(control.value)) {
        for (const email of control.value) {
          const innerControl: FormControl = new FormControl(
            email,
            Validators.email
          );
          if (innerControl.errors && innerControl.errors.email) {
            isPassed = false;
            break;
          }
        }
      } else {
        isPassed = false;
      }

      return isPassed ? null : { emailArray: true };
    };
  }

  requiredArrayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isPassed: boolean =
        Array.isArray(control.value) && control.value.length > 0;
      return isPassed ? null : { required: true };
    };
  }

  patternValidator(): ValidatorFn {  
    return (control: AbstractControl): { [key: string]: any } => {  
      if (!control.value) {  
        return null;  
      }  
      const regex = new RegExp(/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/);  
      const valid = regex.test(control.value);  
      return valid ? null : { invalid: true };  
    };  
  }  

  get f () { return this.schedulerForm.controls }
}
