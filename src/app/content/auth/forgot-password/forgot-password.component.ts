import { RegisterService } from "@core/services/register.service";
import { Component, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "@shared/components/message/messageService.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  submitted: boolean = false;
  private toggleButton: any;
  private nativeElement: Node;
  private sidebarVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private element: ElementRef,
    private router: Router,
    private registerService: RegisterService,
    private messageService: MessageService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");

    this.forgotPasswordForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName("body")[0];
    var sidebar = document.getElementsByClassName("navbar-collapse")[0];
    if (this.sidebarVisible == false) {
      setTimeout(function() {
        toggleButton.classList.add("toggled");
      }, 500);
      body.classList.add("nav-open");
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove("toggled");
      this.sidebarVisible = false;
      body.classList.remove("nav-open");
    }
  }

  submit() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.registerService
      .forgotPassword(this.forgotPasswordForm.value.email)
      .subscribe(result => {
        if (result.status == 200) {
          this.router.navigate(["/auth/login"]);
          this.messageService.showMessage({
            type: "success",
            title: "",
            body:
              "Reset password link sent successfully, Please check your mail box."
          });
        } else {
          this.messageService.showMessage({
            type: "error",
            title: "",
            body: result.message
          });
        }
      });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }
}
