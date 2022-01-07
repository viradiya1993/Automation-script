import {
  AuthService,
  OrganizationService,
  RegisterService,
} from "@core/services";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginModel } from "@shared/models";
import { MessageService } from "@shared/components/message/messageService.service";
import { AHQ_SUPPORT } from "@app/shared/configs";

@Component({
  selector: "app-login-cmp",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  loginDetail: LoginModel = new LoginModel();
  authData: any = null;
  returnUrl: string;

  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private element: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private registerService: RegisterService,
    private organizationService: OrganizationService,
    private messageService: MessageService
  ) {
    this.authData = JSON.parse(localStorage.getItem("rememberMe"));

    if (this.authService.isAuthenticated()) {
      this.router.navigate(["dashboard"]);
    } else {
      this.nativeElement = element.nativeElement;
      this.sidebarVisible = false;
    }
  }

  ngOnInit() {
    let navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");

    this.loginForm = this.formBuilder.group({
      username: [
        this.authData ? this.authData.username : "",
        Validators.compose([Validators.required]),
      ],
      password: [
        this.authData ? this.authData.password : "",
        Validators.compose([Validators.required]),
      ],
      rememberMe: [this.authData],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"]
      ? decodeURIComponent(this.route.snapshot.queryParams["returnUrl"])
      : "/dashboard";
  }

  get f() {
    return this.loginForm.controls;
  }

  sidebarToggle() {
    let toggleButton = this.toggleButton;
    let body = document.getElementsByTagName("body")[0];
    let sidebar = document.getElementsByClassName("navbar-collapse")[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
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

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    let userData = {
      username: this.loginForm.value["username"],
      password: this.loginForm.value["password"],
    };

    this.serviceLogin(userData);
  }

  serviceLogin(loginData: any) {
    this.authService.login(loginData).subscribe(
      (result) => {
        if (result) {
          localStorage.clear();
          const token = result.token;
          localStorage.setItem("token", token);

          this.registerService
            .show(loginData.username)
            .subscribe((response: any) => {
              if (response) {
                localStorage.setItem("user", JSON.stringify(response));
                this.organizationService
                  .show(response.organizationId)
                  .subscribe((org) => {
                    if (response.userRole) {
                      localStorage.setItem(
                        "user-role",
                        JSON.stringify(response.userRole)
                      );
                      let role = response.userRole;
                      if (role && role != AHQ_SUPPORT) {
                        localStorage.setItem("projectId", response.projectId);
                      }
                    }

                    localStorage.setItem(
                      "organizationId",
                      response.organizationId
                    );
                    localStorage.setItem("organization", JSON.stringify(org));

                    if (this.loginForm.value["rememberMe"]) {
                      const rememberMe = loginData;
                      localStorage.setItem(
                        "rememberMe",
                        JSON.stringify(rememberMe)
                      );
                    }

                    if (response.firstLogin) {
                      this.router.navigate(["/landing-page"]);
                    } else {
                      // console.log(this.returnUrl);
                      // this.router.navigate(["/dashboard"]);
                      this.router.navigate([this.returnUrl]);
                    }

                    this.messageService.showMessage({
                      type: "success",
                      title: "",
                      body: "Login Successfully...",
                    });
                  });
              }
            });
        }
      },
      (err) => {
        this.messageService.showMessage({
          type: "error",
          title: "Login failed",
          body: "You have entered incorrect credentials or inactive user/organization.",
        });
      }
    );
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }
}
