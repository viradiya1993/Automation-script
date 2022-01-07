import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { COMMA, ENTER, SPACE, TAB } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { MessageService } from "@app/shared/components";
import { UserInfoModel } from "@app/shared/models";
import { RegisterService } from "@core/services";
import { ORGANIZATION_ID } from "@app/shared/configs";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { ProjectUserService } from "../../services/project-user.service";
import { toggleResponse } from "@app/core/helpers";

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE, TAB];
  organizationId = null;
  emailPattern = RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
  invitations: InviteUser[] = [];
  submitted = false;
  emails: string[] = [];
  filteredEmails: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;

  @Input() user: UserInfoModel = null;
  @Output() closeMenu = new EventEmitter();
  @Input() userAddError = '';
  @Output() userAddErrorChange = new EventEmitter();

  @ViewChild("emailInput") emailInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  constructor(
    private _fb: FormBuilder,
    private projectUserService: ProjectUserService,
    private registerService: RegisterService,
    private messageService: MessageService
  ) {
    this.organizationId = localStorage.getItem(ORGANIZATION_ID);
    this.userForm = this._fb.group({
      emailCtrl: ["", Validators.compose([Validators.email])],
    });
  }

  ngOnInit() {}

  addBlur(event) {
    const value = (event.target.value || "").trim();
    this.addUser(value);
  }

  private addUser(value) {
    // const emailValidate = this.emailMatch(value);

    // if (emailValidate) {
    if (!this.validateEmail(value)) {
      if (value.length > 0) {
        this.messageService.showMessage({
          type: "warning",
          title: "Warning",
          body: "Invald email!",
        });
      }
      return;
    }
    let emailIndex = this.emails.findIndex((res) => res === value);

    if (!value) {
      // this.messageService.showMessage({
      //   type: "error",
      //   title: "Error",
      //   body: "Email address is required.",
      // });
    } else if (value && emailIndex === -1) {
      this.emails.push(value);
    } else {
      this.messageService.showMessage({
        type: "warning",
        title: "Warning",
        body: "Email address is already exists.",
      });
    }

    this.userForm.patchValue({
      emailCtrl: null,
    });
    // } else {
    //   this.messageService.showMessage({
    //     type: "error",
    //     title: "Validation Error",
    //     body: "Email address is not valid!",
    //   });
    // }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    this.addUser(value);
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  emailMatch(string) {
    // return this.emailPattern.test(string);
  }

  onUserCancel() {
    this.emails = [];
    this.userForm.reset();
    this.closeMenu.emit();
  }

  saveUserInfo() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return false;
    }
    if (this.emails.length > 0) {
      for (var item of this.emails) {
        if (!this.validateEmail(item)) {
          this.userAddError = item + ' is invalid';
          return false;
        }
        this.invitations.push({
          email: item,
          organizationId: this.organizationId,
          userName: item,
          invited: true,
        });
      }

      this.registerService
        .multipleUser(this.invitations)
        .subscribe((res: any) => {
          let errorMsg = '';
          if (res.validationErrors && res.validationErrors.length > 0) {
            res.validationErrors.forEach((ele: any) => {
            });
            errorMsg = errorMsg + res.validationErrors.length + ' Emails already exists';
          }
          if (res.message !== "Emails sent to the following emails: \n\n") {
            this.userAddError = res.message;
          }
          if (this.userAddError.length > 0) {
            this.userAddError = this.userAddError + '\n\n';
          }
          if (errorMsg.length > 0) {
            this.userAddError = this.userAddError + errorMsg
          }
          this.userAddErrorChange.emit(this.userAddError);
          this.projectUserService.userCreated(null);
          if (!res.validationErrors && res.validationErrors.length === 0) {
            this.emails = [];
            this.userForm.reset();
            this.closeMenu.emit();
          }

          this.invitations = [];
          this.emails = [];
          this.userForm.reset();
          this.closeMenu.emit();
        }, error => {
          this.userAddError = 'An unknown error occurred!';
          this.invitations = [];
          this.emails = [];
          this.userForm.reset();
          this.closeMenu.emit();
        });
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

export interface InviteUser {
  email: String;
  organizationId: String;
  userName: String;
  invited: Boolean;
}
