import { Component, OnInit, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { toggleResponse } from "@app/core/helpers";
import { RegisterService, UserService } from "@app/core/services";
import { MessageService } from "@app/shared/components";
import { UserInfoModel, Project } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
  selector: "app-non-users-list",
  templateUrl: "./non-user-list.component.html",
  styleUrls: ["./non-user-list.component.scss"],
})
export class NonUserListComponent implements OnInit {
  users: UserInfoModel[] = [];
  totalElements: number = 0;
  pageNumber: number = 10;
  currentIndex: number = 0;
  selectedProject: Project = null;
  deleteUserInfo: UserInfoModel = null;

  @Input() projectInput: Project = null;

  constructor(
    private projectUserService: ProjectUserService,
    private userService: UserService,
    private registerService: RegisterService,
    private messageService: MessageService
  ) {
    this.projectUserService.userCreatedObs.subscribe(({ user }) => {
      this.users = [];
      this.totalElements = 0;
      this.pageNumber = 10;
      this.getUser();
    });

    this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
      this.selectedProject = project;
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

    if (this.projectInput) {
      this.selectedProject = this.projectInput;
    }
  }

  ngOnInit() {
    this.getUser();
  }

  private getUser() {
    if (this.selectedProject) {
      this.userService
        .getAllNonAdminUserListProject(this.currentIndex, this.pageNumber)
        .subscribe((user: any) => {
          this.users = user.content;
          this.totalElements = user.totalElements;
          this.pageNumber = user.pageable.pageSize;
        });
    } else {
      this.userService
        .getAllNonAdminUserList(this.currentIndex, this.pageNumber)
        .subscribe((user: any) => {
          this.users = user.content;
          this.totalElements = user.totalElements;
          this.pageNumber = user.pageable.pageSize;
        });
    }
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
