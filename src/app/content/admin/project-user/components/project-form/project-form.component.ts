import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { toggleResponse } from "@app/core/helpers";
import { ProjectService } from "@app/core/services";
import { MessageService } from "@app/shared/components";
import { ORGANIZATION_ID } from "@app/shared/configs";
import { Project, ProjectInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
  selector: "app-project-form",
  templateUrl: "./project-form.component.html",
})
export class ProjectFormComponent implements OnInit, AfterViewInit {
  projectFormGroup: FormGroup;
  projectInfo: ProjectInfoModel = new ProjectInfoModel();

  @Input() project: Project;
  @Output() closeMenu = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private projectService: ProjectService,
    private projectUserService: ProjectUserService,
    private messageService: MessageService
  ) {
    this.projectFormGroup = this._fb.group({
      projectName: ["", Validators.compose([Validators.required])],
      description: [""],
      isEnabled: [true],
    });
  }

  ngOnInit() {
    if (this.project) {
      this.projectFormGroup.patchValue(this.project);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.project) {
      this.projectFormGroup.patchValue(this.project);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.project) {
        this.projectFormGroup.patchValue(this.project);
      }
    }, 1500);
  }

  onProjectSaveClick() {
    if (this.projectFormGroup.invalid) {
      return;
    }

    this.projectInfo.orgId = localStorage.getItem(ORGANIZATION_ID);

    if (this.project && this.project.id) {
      this.projectService
        .update(this.project.id, this.projectInfo)
        .subscribe((data: any) => {
          this.projectUserService.projectUpdated(data);
          toggleResponse(this.messageService, data);
        });
    } else {
      this.projectService.store(this.projectInfo).subscribe((data: any) => {
        this.projectUserService.projectCreated(data);
        toggleResponse(this.messageService, data);
      });
    }

    if (!this.project) {
      this.formResetClose();
      this.projectFormGroup.controls["isEnabled"].setValue(true);
    }
  }

  private formResetClose() {
    this.projectFormGroup.reset();
    this.closeMenu.emit();
  }

  onProjectCancelClick() {
    this.closeMenu.emit();
    this.projectFormGroup.patchValue(this.project);
  }
}
