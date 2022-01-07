import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { toggleResponse } from "@app/core/helpers";
import {
  ProjectService,
  RegisterService,
  RoleService,
  UserService,
} from "@app/core/services";
import { MessageService } from "@app/shared/components";
import { Project, Role, UserInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
})
export class UsersListComponent implements OnInit {
  users: UserInfoModel[] = [];
  project: Project = null;
  totalElements: number = 0;
  pageNumber: number = 10;
  currentIndex: number = 0;
  roles: Role[] = [];
  deleteUserInfo: UserInfoModel = null;

  @Input("projectInput") projectInput: Project = null;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private roleService: RoleService,
    private registerService: RegisterService,
    private projectUserService: ProjectUserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.projectInput) {
      this.project = this.projectInput;
      this.currentIndex = 0;
      this.pageNumber = 10;
      this.getUserList();
    }
    this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
      this.project = project;
      this.currentIndex = 0;
      this.pageNumber = 10;
      this.getUserList();
    });

    this.projectUserService.userUpdatedObs.subscribe(({ user }) => {
      this.currentIndex = 0;
      this.pageNumber = 10;
      this.getUserList();
    });

    this.projectUserService.userAssignObs.subscribe(({ user }) => {
      this.currentIndex = 0;
      this.pageNumber = 10;
      this.getUserList();
    });

    this.projectUserService.userUpdatedObs.subscribe(({ user }) => {
      this.currentIndex = 0;
      this.pageNumber = 10;
      this.getUserList();
    });

    this.roleService.getAssignList().subscribe((data: Role[]) => {
      this.roles = data;
    });
  }

  private getUserList() {
    this.userService
      .getAllAssignedNonAdminUserListProject(this.currentIndex, this.pageNumber)
      .subscribe((userData: any) => {
          this.users = userData.content;
          this.totalElements = userData.totalElements;
          this.pageNumber = userData.pageable.pageSize; 
      });
  }

  updateUserStatus(user: UserInfoModel, event: MatSlideToggleChange) {
    if (event.checked) {
      this.userService.activate(user.id).subscribe((data: any) => {
        this.projectUserService.userUpdated(null);
        toggleResponse(this.messageService, data);
      });
    } else {
      this.userService.deactivate(user.id).subscribe((data: any) => {
        this.projectUserService.userUpdated(null);
        toggleResponse(this.messageService, data);
      });
    }
  }

  resendInvitationUser(user: UserInfoModel) {
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
    this.projectService
      .removeUsers(this.project.id, this.deleteUserInfo.id)
      .subscribe((data: any) => {
        toggleResponse(this.messageService, data);
        this.deleteUserInfo = null;
        this.projectUserService.userRoleAssign(this.project.id, null);
      });
  }

  pageChange(pageEvent: PageEvent) {
    this.currentIndex = pageEvent.pageIndex;
    this.pageNumber = pageEvent.pageSize || 10;
    this.getUserList();
  }
}
