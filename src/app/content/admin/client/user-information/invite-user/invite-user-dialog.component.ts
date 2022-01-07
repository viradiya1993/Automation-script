import { MatDialogRef } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { RegisterService, CommonService, GlobalService } from "@core/services";
import { existingEmailValidator } from "@app/shared/validators";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "invite-user",
  templateUrl: "./invite-user-dialog.component.html",
  styleUrls: ["./invite-user-dialog.component.scss"]
})
export class InviteUserComponent implements OnInit {
  userForm: FormGroup;
  items: FormArray;
  organizationId = null;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  invitations: InviteUser[] = [];
  submitted = false;

  constructor(
    private _fb: FormBuilder,
    private commonService: CommonService,
    private globalService: GlobalService,
    private registerService: RegisterService,
    private messageService: MessageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) {
    this.globalService.goal.subscribe(res => {
      if (res.orgId) {
        this.organizationId = res.orgId;
      } else {
        let org = localStorage.getItem("organizationId");
        this.organizationId = org;
      }
    });
  }

  ngOnInit() {
    this.dialogRef.updateSize("60%", "80%");

    this.userForm = this._fb.group({
      items: this._fb.array([this.createUser()], [Validators.required])
    });
  }

  createUser(): FormGroup {
    return this._fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern)
        ]),
        [existingEmailValidator(this.registerService)]
      ],
      firstName: ["", Validators.compose([Validators.required])],
      lastName: ["", Validators.compose([Validators.required])]
    });
  }

  // convenience getter for easy access to form fields
  get f(): FormArray {
    return this.userForm.get("items") as FormArray;
  }

  get itemArray() {
    return this.userForm.get("items") as FormArray;
  }

  getControls() {
    return (this.userForm.get("items") as FormArray).controls;
  }

  addUser() {
    this.items = this.itemArray;
    this.items.push(this.createUser());
  }

  removeUser(index) {
    this.items = this.itemArray;
    this.items.removeAt(index);
  }

  saveUserInfo() {
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
          invited: true
        });
      }

      this.registerService.multipleUser(this.invitations).subscribe(res => {
        this.messageService.showMessage({
          type: "success",
          title: "",
          body: "Invitation Sent Successfully."
        });
        this.dialog.closeAll();
        this.items.clear();
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
