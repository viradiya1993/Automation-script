import { AHQ_SUPPORT } from "@shared/configs/roles";
import { Component, OnInit, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  AuthService,
  CommonService,
  OrganizationService,
  RegisterService,
} from "@core/services/";
import { MessageService } from "@shared/components/message/messageService.service";
import { Router } from "@angular/router";
import { Country } from "@app/shared/models";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

declare let $: any;

@Component({
  selector: "app-password-cmp",
  templateUrl: "./password.component.html",
})
export class PasswordComponent implements OnInit {
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  passwordForm: FormGroup;
  passwordCheck: string;
  submitted: boolean = false;
  hasError: {};
  invitedUser: string = localStorage.getItem("invited");
  forgotPassword: string = localStorage.getItem("tokenForgotPassword");
  selectedCountry = "+91";
  countryCode: Country[] = [];
  filteredOptions: Observable<Country[]>;
  countryObject: any = null;

  constructor(
    private element: ElementRef,
    public router: Router,
    private _fb: FormBuilder,
    private registerService: RegisterService,
    private authService: AuthService,
    private commonService: CommonService,
    private organizationService: OrganizationService,
    private messageService: MessageService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;

    this.passwordForm = this._fb.group({
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      cpassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });

    if (this.invitedUser === "true" && !this.forgotPassword) {
      this.passwordForm.addControl(
        "firstName",
        this._fb.control("", [Validators.required])
      );
      this.passwordForm.addControl(
        "lastName",
        this._fb.control("", [Validators.required])
      );
      this.passwordForm.addControl("phone", this._fb.control(""));
      this.passwordForm.addControl("countryCode", this._fb.control(""));

      this.getCurrencyList();

      this.filteredOptions = this.passwordForm.controls[
        "countryCode"
      ].valueChanges.pipe(
        startWith(""),
        map((value: any) => (typeof value === "string" ? value : value.name)),
        map((name) => (name ? this._filter(name) : this.countryCode.slice()))
      );
    }
  }

  ngOnInit() {
    let navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countryCode.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.passwordForm.controls;
  }

  changeCountry(event) {
    if (event?.dial_code) {
      this.selectedCountry = event.dial_code;
    }
  }

  displayFn(code?: Country): string | undefined {
    return code ? code.name : undefined;
  }

  countryBlur() {
    setTimeout((_) => {
      // Wait till change country to be applied
      this.assignSelectedCompany();
    }, 500);
  }

  getCurrencyList() {
    this.commonService.getCurrencyList().subscribe((res) => {
      this.countryCode = res;
      this.assignSelectedCompany();
    });
  }

  private assignSelectedCompany() {
    if (this.selectedCountry) {
      const countryObject = this.countryCode.find(
        (country) => country.dial_code === this.selectedCountry
      );
      if (countryObject) {
        this.countryObject = countryObject;
        return;
      }
    }

    this.countryObject = null;
    this.selectedCountry = null;
  }

  setPassword() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    if (
      this.passwordForm.value.password.trim() !==
      this.passwordForm.value.cpassword.trim()
    ) {
      this.messageService.showMessage({
        type: "error",
        title: "",
        body: "Password and confirm Password must be equal",
      });
      return;
    }

    localStorage.setItem("password", this.passwordForm.value.password);

    let dataObject = {};

    if (this.invitedUser === "true" && !this.forgotPassword) {
      dataObject = {
        firstName: this.passwordForm.value.firstName,
        lastName: this.passwordForm.value.lastName,
        phone: {
          countryCode: this.selectedCountry,
          phoneNumber: this.passwordForm.value.phone,
        },
      };
    }

    this.registerService
      .setPassword(this.passwordForm.value.password, dataObject)
      .subscribe(
        (result) => {
          if (result.status === 200) {
            const { email } = result;
            const password = localStorage.getItem("password");
            localStorage.clear();
            this.loggedAfterSetPassword(email, password);
          } else {
            const { message, validationErrors } = result;
            if (validationErrors) {
              validationErrors.forEach((item) => {
                this.hasError[item.key] = item.message;
              });
              this.messageService.showMessage({
                type: "error",
                title: "",
                body: message,
              });
            }
          }
        },
        (err) => {
          const { message, validationErrors } = err.error;
          validationErrors.forEach((item) => {
            this.hasError[item.key] = item.message;
          });
          this.messageService.showMessage({
            type: "error",
            title: "",
            body: message,
          });
        }
      );
  }

  loggedAfterSetPassword(email, password) {
    this.authService.login({ username: email, password }).subscribe(
      (authResponse) => {
        if (authResponse) {
          const token = authResponse.token;
          localStorage.setItem("token", token);

          this.registerService.show(email).subscribe((response) => {
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

                  if (response.firstLogin) {
                    this.router.navigate(["/landing-page"]);
                  } else {
                    this.router.navigate(["/dashboard"]);
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
          title: "",
          body: "You have entered incorrect email or password. Please use correct email and password or click on forget password link to reset password.",
        });
      }
    );
  }
}
