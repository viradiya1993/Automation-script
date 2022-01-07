import { SUBSCRIBER } from "./../../../../shared/configs/roles";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserInfoModel, UserRoleModal } from "@shared/models";
import {
  GlobalService,
  // RoleService,
  UserService,
  CommonService,
} from "@core/services";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RegisterService } from "@core/services";
import { existingEmailValidator } from "@app/shared/validators";

@Component({
  selector: "app-user-info-dialog",
  templateUrl: "user-information-dialog.html",
  styleUrls: ["./user-information.component.css"],
})
export class UserInfoDialogComponent implements OnInit {
  userInfoForm: FormGroup;
  userInfo: UserInfoModel = new UserInfoModel();
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  countryCode = "";
  userRole: UserRoleModal = new UserRoleModal();
  submitted: boolean = false;
  organizationId = null;

  constructor(
    private _fb: FormBuilder,
    private commonService: CommonService,
    private registerService: RegisterService,
    private userService: UserService,
    private globalService: GlobalService,
    private messageService: MessageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) {
    this.globalService.goal.subscribe((res) => {
      if (res.flag === "userInfo") {
        if (res.orgId) {
          this.organizationId = res.orgId;
        } else {
          let org = localStorage.getItem("organizationId");
          this.organizationId = org;
        }
      } else {
        // this.userInfo = res;
        Object.assign(this.userInfo, res);
        if (!res.phone) {
          this.userInfo.phone = {
            countryCode: "",
            phoneNumber: "",
          };
        }
        // this.userInfoForm.value.phone = res.phone.phoneNumber;
        // this.userInfoForm.value.countryCode = res.phone.countryCode;
      }
    });

    this.getCurrencyList();
    // this.getRole();
  }

  ngOnInit() {
    this.dialogRef.updateSize("60%", "80%");

    if (this.userInfo.userId) {
      this.userInfoForm = this._fb.group({
        email: [""],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        password: [""],
        phone: [""],
        countryCode: ["+91"],
      });
    } else {
      this.userInfoForm = this._fb.group({
        email: [
          "",
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.pattern(this.emailPattern),
          ]),
          [existingEmailValidator(this.registerService)],
        ],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        password: ["", Validators.required],
        phone: [""],
        countryCode: ["+91"],
      });
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userInfoForm.controls;
  }

  getCurrencyList() {
    this.commonService.getCurrencyList().subscribe((res) => {
      this.countryCode = res;
    });
  }

  saveUserInfo() {
    this.submitted = true;

    if (this.userInfoForm.invalid) {
      return;
    }

    this.userInfo.phone.countryCode = this.userInfoForm.value.countryCode;
    this.userInfo.phone.phoneNumber = this.userInfoForm.value.phone;
    // this.userInfo.organizationId = this.organizationId;
    // this.userInfo.userName = this.userInfoForm.value.email;

    if (this.userInfo.userId) {
      this.userService
        .update(this.userInfo.userId, this.userInfo)
        .subscribe((result) => {
          if (result.status <= 300) {
            this.messageService.showMessage({
              type: "success",
              title: "",
              body: result.details,
            });
            this.dialog.closeAll();
          } else {
            this.messageService.showMessage({
              type: "error",
              title: "",
              body: result.message,
            });
          }
        });
    } else {
      this.userService.store(this.userInfo).subscribe((result) => {
        if (result.status <= 300) {
          this.userRole.roleId = SUBSCRIBER;
          this.userRole.userId = result.id;
          this.messageService.showMessage({
            type: "success",
            title: "",
            body: result.details,
          });
          this.dialog.closeAll();
          this.setUserRole();
        } else {
          this.messageService.showMessage({
            type: "error",
            title: "",
            body: result.message,
          });
        }
      });
    }
  }

  setUserRole() {
    this.userService.setUserRole(this.userRole).subscribe((res) => {
      if (res) {
        this.globalService.changeGoal("User Saved");
        this.messageService.showMessage({
          type: "success",
          title: "",
          body: res.details,
        });
        this.userInfoForm.reset();
      }
    });
  }
}
