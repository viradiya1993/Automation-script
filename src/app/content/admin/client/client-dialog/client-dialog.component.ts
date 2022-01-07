import { AuthErrorModel } from "@shared/models/auth.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { OrganizationModal } from "@shared/models/";
import { GlobalService, OrganizationService } from "@core/services/";
import { MessageService } from "@app/shared/components/message/messageService.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-client-info-dialog",
  templateUrl: "client-dialog.component.html",
})
export class ClientDialogComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  client: OrganizationModal = new OrganizationModal();
  submitted: boolean = false;
  error: AuthErrorModel = new AuthErrorModel();
  sub: any = null;

  constructor(
    private _fb: FormBuilder,
    private organizationService: OrganizationService,
    private globalService: GlobalService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.clientForm = this._fb.group({
      orgName: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.globalService.goal.subscribe((res) => {
      if (res.flag === "client") {
        this.client.id = res.id;
      } else {
        this.client = res;
      }
    });
  }

  //* Organization Validation
  validateOrgName() {
    this.organizationService
      .validateOrgName(this.client.orgName)
      .subscribe((result) => {
        if (result.status === 200) {
          this.error.domainCode = 200;
          this.error.domain = true;
          this.error.domainValue = result.details;
        } else if (result.status === 400) {
          this.error.domain = true;
          this.error.domainCode = 400;
          this.error.domainValue = result.details;
        }
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.clientForm.controls;
  }

  submit() {
    this.submitted = true;

    if (this.clientForm.invalid) {
      return;
    }

    if (this.client.id) {
      this.organizationService
        .update(this.client.id, this.client)
        .subscribe((result) => {
          this.messageService.showMessage({
            type: "success",
            title: "",
            body: result.details,
          });
          this.globalService.changeGoal("Client Saved");
          this.dialog.closeAll();
          this.clientForm.reset();
        });
    } else {
      this.organizationService.store(this.client).subscribe((result) => {
        this.messageService.showMessage({
          type: "success",
          title: "",
          body: result.details,
        });
        this.globalService.changeGoal("Client Saved");
        this.dialog.closeAll();
        this.clientForm.reset();
      });
    }
  }

  ngOnDestroy() {
    if (this.sub != undefined) {
      this.sub.unsubscribe();
    }
  }
}
