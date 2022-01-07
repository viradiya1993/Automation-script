import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserRoleModal } from "@shared/models";
import { RegisterService } from "@core/services/";

@Component({
  selector: "app-confirm-cmp",
  templateUrl: "./confirm.component.html",
})
export class ConfirmComponent implements OnInit {
  roleId: string;
  userRole: UserRoleModal = new UserRoleModal();
  token: string = "";

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params.token;
      localStorage.setItem("tokenPassword", this.token);
      if (params.forgotPassword) {
        localStorage.setItem("tokenForgotPassword", params.forgotPassword);
      }
    });

    this.registerService.confirm(this.token).subscribe(
      (res) => {
        if (res.message === "Success" && res.status === 200) {
          localStorage.setItem("organizationId", res.organizationId);
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("invited", res.invited);
          this.router.navigate(["/auth/password"]);
        } else {
          this.router.navigate(["/error"]);
        }
      },
      (err) => {
        this.router.navigate(["/error"]);
      }
    );
  }
}
