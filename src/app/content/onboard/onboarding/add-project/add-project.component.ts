import { IOnboardProjectInfo } from './../../onboard.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-add-onboard-project-info",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"],
})

export class AddProjectComponent implements OnInit {

  @Input() projectInfo: IOnboardProjectInfo;
  @Output() submitForm = new EventEmitter<IOnboardProjectInfo>();
  @Output() skipToDashboard = new EventEmitter<null>();

  public projectInfoForm: FormGroup;
  public submitted = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.projectInfoForm = this.fb.group({
      projectName: [this.projectInfo?.name, Validators.compose([Validators.required])],
      description: [this.projectInfo?.description],
    });
  }

  get f() {
    return this.projectInfoForm.controls;
  }

  public addProject() {
    this.submitted = true;
    if (this.projectInfoForm.invalid) {
      return false;
    }

    const projectInfo: IOnboardProjectInfo = {
      name: this.projectInfoForm.get('projectName').value,
      description: this.projectInfoForm.get('description').value
    };
    this.submitForm.next(projectInfo);
  }

}

