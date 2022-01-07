import { Component, OnInit, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { toggleResponse } from "@app/core/helpers";
import { RegisterService, UserService } from "@app/core/services";
import { MessageService } from "@app/shared/components";
import { UserInfoModel, Project } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
  selector: "app-available-users-list",
  templateUrl: "./available-users-list.component.html",
  styleUrls: ["./available-users-list.component.scss"],
})
export class AvailableUsersListComponent implements OnInit {
  users: UserInfoModel[] = [];
  totalElements: number = 0;
  pageNumber: number = 10;
  currentIndex: number = 0;
  project: Project = null;
  deleteUserInfo: UserInfoModel = null;

  @Input("projectInput") projectInput: Project = null;

  constructor(
    private projectUserService: ProjectUserService,
    private userService: UserService,
    private registerService: RegisterService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.projectInput) {
      this.project = this.projectInput;
      this.getUser();
    }

    this.projectUserService.userCreatedObs.subscribe(({ user }) => {
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });

    this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
      this.project = project;
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });

    this.projectUserService.userUpdatedObs.subscribe(({ user }) => {
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });

    this.projectUserService.userDeletedObs.subscribe(({ user }) => {
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });

    this.projectUserService.userAssignObs.subscribe(({ projectId, user }) => {
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });

    this.projectUserService.projectDeletedObs.subscribe(({ project }) => {
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });
  }

  private getUser() {
    this.userService
      .getAllNonAdminUserListProject(this.currentIndex, this.pageNumber)
      .subscribe((userData: any) => {
        this.users = userData.content;
        this.totalElements = userData.totalElements;
        this.pageNumber = userData.pageable.pageSize;
      });
  }

  updateUserStatus(user: UserInfoModel, event: MatSlideToggleChange) {
    if (event.checked) {
      this.userService.activate(user.userId).subscribe((data: any) => {
        this.projectUserService.userUpdated(null);
        toggleResponse(this.messageService, data);
      });
    } else {
      this.userService.deactivate(user.userId).subscribe((data: any) => {
        this.projectUserService.userUpdated(null);
        toggleResponse(this.messageService, data);
      });
    }
  }

  resendInvitationUser(user: UserInfoModel) {
    console.log(user);
    if (user && user.email) {
      this.registerService.resendInvite(user.email).subscribe((res: any) => {
        toggleResponse(this.messageService, res);
      });
    }
  }

  setUserToRemove(user: UserInfoModel) {
    this.deleteUserInfo = null;
    this.deleteUserInfo = user;
  }

  deleteUser() {
    if (this.deleteUserInfo) {
      this.userService
        .delete(this.deleteUserInfo.userId)
        .subscribe((data: any) => {
          this.projectUserService.userDeleted(null);
          toggleResponse(this.messageService, data);
          this.deleteUserInfo = null;
          // this.users = [];
          // this.totalElements = 0;
          // this.pageNumber = 10;
          // this.getUser();
        });
    }
  }

  pageChange(pageEvent: PageEvent) {
    this.currentIndex = pageEvent.pageIndex;
    this.pageNumber = pageEvent.pageSize;
    this.getUser();
  }
}
