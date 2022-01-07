import { Country } from "./../../../shared/models/country.model";
import { CommonService } from "@core/services/common.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { RegisterService, ProjectService } from "@core/services";
import { AuthErrorModel, RegisterModel, RegistrationObj } from "@shared/models";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Location } from '@angular/common';

@Component({
  selector: "app-register-cmp",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  test: Date = new Date();
  registrationModel: RegisterModel = new RegisterModel();
  error: AuthErrorModel = new AuthErrorModel();
  countryCode: Country[] = [];
  submitted = false;
  selectedCountry = "+91";
  success: string = null;
  filteredOptions: Observable<Country[]>;
  countryObject: any = null;
  hasError = {};
  errorMsg: string = "";
  registrationObj: RegistrationObj;

  constructor(
    private location: Location,
    private _fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private registerService: RegisterService,
    private commonService: CommonService,
    private projectService: ProjectService
  ) {
    this.getCurrencyList();
  }

  ngOnInit() {

    const routeParams = this.route.snapshot.queryParamMap;
    const accessCode = routeParams.get('accessCode');
    if (accessCode) {
      this.registerService.validateAccessCode(accessCode).subscribe(registrationObj => {
        this.registrationObj = registrationObj;
        this.registrationModel.user.accessCode = this.registrationObj.code;
        this.location.replaceState('/auth/register');
      },
      err => {
        this.registrationObj = err.error;
        this.errorMsg = err.error.message.replace("support@automationhq.ai", '<a href="mailto:support@automationhq.ai">AHQ Support</a>');
        this.location.replaceState('/auth/register');
      });
    }

    const body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");
    body.classList.add("off-canvas-sidebar");
    this.registrationForm = this._fb.group({
      company: ["", Validators.compose([Validators.required])],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailPattern),
        ]),
      ],
      firstName: ["", Validators.compose([Validators.required])],
      lastName: ["", Validators.compose([Validators.required])],
      phone: [
        "",
        Validators.compose([Validators.required, Validators.pattern("[0-9]*")]),
      ],
      countryCode: [null, Validators.compose([])],
      accessCode: ["", Validators.compose([Validators.required])],
      termsAccepted: [null, Validators.compose([Validators.requiredTrue])],
    });
    this.filteredOptions = this.registrationForm.controls[
      "countryCode"
    ].valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === "string" ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.countryCode.slice()))
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  displayFn(code?: Country): string | undefined {
    return code ? code.name : undefined;
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.countryCode.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  getCurrencyList() {
    this.commonService.getCurrencyList().subscribe((res) => {
      this.countryCode = res;
      this.assignSelectedCompany();
    });
  }

  // * Registration Form Submit
  register() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    this.registrationModel.user.userName = this.registrationForm.value.email;
    this.registrationModel.user.phone.countryCode = this.selectedCountry;

    this.registerService.register({ ...this.registrationModel }).subscribe(
      (response) => {
        if (response.status === 200) {
          this.success =
            "Thank you for registering account with AHQ. Please check your email and activate your account.";
            this.errorMsg = "";
          localStorage.clear();
          setTimeout(() => {
            this.redirectLogin();
          }, 15000);
        } else {
          const { message, validationErrors } = response;
          if (validationErrors) {
            validationErrors.forEach((item) => {
              this.hasError[item.key] = item.message;
            });
            this.errorMsg = message.replace("support@automationhq.ai", '<a href="mailto:support@automationhq.ai">AHQ Support</a>');
          }
        }
      },
      (err) => {
        const { message, validationErrors } = err.error;
        validationErrors.forEach((item) => {
          this.hasError[item.key] = item.message;
        });
        this.errorMsg = message.replace("support@automationhq.ai", '<a href="mailto:support@automationhq.ai">AHQ Support</a>');
      }
    );
  }

  changeCountry(event) {
    if (event?.dial_code) {
      this.selectedCountry = event.dial_code;
    }
  }

  countryBlur() {
    setTimeout(_ => { // Wait till change country to be applied
      this.assignSelectedCompany();
    }, 500)
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

  // * Redirect Login
  redirectLogin() {
    this.router.navigate(["auth/login"]);
  }

  createProject(orgId, userIds) {
    this.projectService
      .store({
        description: "Demo",
        isEnabled: true,
        orgId: orgId,
        projectName: "Demo",
        userIds: userIds,
      })
      .subscribe((result) => { });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
    body.classList.remove("off-canvas-sidebar");
  }
}
