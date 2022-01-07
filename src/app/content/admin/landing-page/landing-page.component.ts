import { UserInfoModel } from "@shared/models";
import { UserService, LocalStorageService } from "@core/services";
import { existingEmailValidator } from "@app/shared/validators";
import { RegisterService } from "./../../../core/services/register.service";
import { Router } from "@angular/router";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { ProjectInfoModel } from "../../../shared/models/project-info.model";
import { ProjectService } from "../../../core/services/project.service";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VideoDialogComponent } from "./video-dialog.component";
import {
  SUBSCRIBER,
  TESTER,
  PROJECT_ADMIN,
  QA_MANAGER,
  AUTH_USER_ROLE,
  AHQ_SUPPORT,
} from "@app/shared/configs";

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  layoutProject = true;
  projectInfoForm: FormGroup;
  userForm: FormGroup;
  items: FormArray;
  organizationId = null;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  invitations: InviteUser[] = [];
  projectInfo: ProjectInfoModel = new ProjectInfoModel();
  submitted = false;
  userInfo: UserInfoModel;
  toggleFrame1 = true;
  toggleFrame2 = true;
  toggleFrame3 = true;
  subscriberRole = [SUBSCRIBER, PROJECT_ADMIN, AHQ_SUPPORT];
  testerRole = TESTER;
  qaManagerRole = QA_MANAGER;
  userRole: any = JSON.parse(localStorage.getItem(AUTH_USER_ROLE));

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private registerService: RegisterService,
    private messageService: MessageService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    let org = localStorage.getItem("organizationId");
    this.organizationId = org;
  }

  ngOnInit() {
    this.projectInfoForm = this._fb.group({
      description: [""],
      projectName: ["", Validators.compose([Validators.required])],
      isEnabled: [true],
    });

    this.userInfo = JSON.parse(localStorage.getItem("user"));

    if (this.userInfo.firstTimeLogin) {
      this.userService.firstTimeLogin(this.userInfo.userId).subscribe((res) => {
        this.userInfo.firstTimeLogin = false;
      });
    }

    this.userForm = this._fb.group({
      items: this._fb.array([this.createUser()], [Validators.required]),
    });
  }

  openVideoDialog(url: any) {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: "90%",
      height: "90%",
      data: { link: url },
    });
  }

  get f() {
    return this.projectInfoForm.controls;
  }

  getControls() {
    return (this.userForm.get("items") as FormArray).controls;
  }

  // convenience getter for easy access to form fields
  get u(): FormArray {
    return this.userForm.get("items") as FormArray;
  }

  get itemArray() {
    return this.userForm.get("items") as FormArray;
  }

  addUser() {
    this.items = this.itemArray;
    this.items.push(this.createUser());
  }

  removeUser(index) {
    this.items = this.itemArray;
    this.items.removeAt(index);
  }

  createUser(): FormGroup {
    return this._fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ]),
        [existingEmailValidator(this.registerService)],
      ],
      firstName: ["", Validators.compose([Validators.required])],
      lastName: ["", Validators.compose([Validators.required])],
    });
  }

  submitProject() {
    if (this.projectInfoForm.invalid) {
      return;
    }

    let org = localStorage.getItem("organizationId");
    this.projectInfo.orgId = org;
    this.projectInfo.projectName =
      this.projectInfoForm.controls["projectName"].value;
    this.projectInfo.description =
      this.projectInfoForm.controls["description"].value;
    this.projectInfo.isEnabled = true;

    this.projectService.store(this.projectInfo).subscribe((result) => {
      this.projectInfoForm.reset();
      this.layoutProject = !this.layoutProject;
    });
  }

  submitUser() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return false;
    }

    if (this.userForm.value["items"].length > 0) {
      for (var item of this.userForm.value["items"]) {
        this.invitations.push({
          email: item["email"],
          firstName: item["firstName"],
          lastName: item["lastName"],
          organizationId: this.organizationId,
          userName: item["email"],
          invited: true,
        });
      }

      this.registerService.multipleUser(this.invitations).subscribe((res) => {
        this.messageService.showMessage({
          type: "success",
          title: "",
          body: "Invitation Sent Successfully.",
        });
        this.router.navigate(["/dashboard"]);
      });
    }
  }
}

export interface InviteUser {
  email: String;
  firstName: String;
  lastName: String;
  organizationId: String;
  userName: String;
  invited: Boolean;
}
