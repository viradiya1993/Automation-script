import { RegisterService } from '@app/core/services';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { Role } from '@app/shared/models';
import { RoleService } from '@core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AssignableRole } from './../../onboard.model';

@Component({
  selector: "app-add-onboard-users",
  templateUrl: "./add-users.component.html",
  styleUrls: ["./add-users.component.scss"],
})

export class AddUsersComponent implements OnInit {

  public userForm: FormGroup;
  public submitted = false;

  public roles: AssignableRole[] = [];

  @Output() submitForm = new EventEmitter<AssignableRole[]>();
  @Output() back = new EventEmitter<null>();
  @Output() skipToDashboard = new EventEmitter<null>();

  constructor(private roleService: RoleService) { }

  ngOnInit() {
    this.getRoles();
  }

  private getRoles() {
    this.roleService.getAssignList().pipe(
      map(roles => this.convertToAssignable(roles))
    ).subscribe(res => this.roles = res);
  }

  private convertToAssignable(roles: Role[]): AssignableRole[] {
    roles = roles.filter(item => item.assignableToProject);
    return roles.map(item => ({
      id: item.id,
      roleName: item.roleName,
      emailAddresses: [],
      emailInput: ''
    }))
  }

  goToProjectInfo() {
    this.back.next()
  }

  public onSubmit() {
    this.submitForm.next(this.roles);
  }

  /* Email */
  public onEmailAddressKeydown(event: KeyboardEvent, addresses: string[], emailModel: NgModel): boolean {
    if (event.key === ';' || event.key === ',') {
      this.addEmailFromInput(addresses, emailModel);
      return false;
    }
  }

  public onEmailAddressKeyup(event: KeyboardEvent, addresses: string[], emailModel: NgModel): boolean {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.addEmailFromInput(addresses, emailModel);
      return false;
    }
  }

  public onEmailAddressBlur(addresses: string[], emailModel: NgModel): boolean {
    setTimeout(() => this.addEmailFromInput(addresses, emailModel));
    return true;
  }

  private addEmailFromInput(addresses: string[], emailModel: NgModel) {
    if (emailModel.valid && emailModel.value.length > 0) {
      this.addEmailAddress(emailModel.value, addresses);
      emailModel.reset('');
    } else if (emailModel.value.length > 0) {
      emailModel.control.markAsTouched();
    } else {
      emailModel.control.markAsUntouched();
    }
  }

  public onEmailSelect({ item }, addresses, emailModel: NgModel) {
    this.addEmailAddress(item, addresses);
    setTimeout(() => emailModel.reset(''));
  }

  private addEmailAddress(email: string, addresses: string[]) {
    addresses.push(email);
  }

  public removeEmailAddress(addresses: string[], index: number) {
    addresses.splice(index, 1);
  }

}

