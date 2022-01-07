import { AfterViewInit, Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
import { GlobalService, ProjectService, RoleService } from "@app/core/services";
import { ORGANIZATION_ID } from "@app/shared/configs";
import { Project, Role, UserInfoModel } from "@app/shared/models";
import { ProjectUserService } from "../services/project-user.service";

@Component({
  selector: "app-project-user",
  templateUrl: "./project-user.component.html",
  styleUrls: ["./project-user.component.scss"],
})
export class ProjectUserComponent implements OnInit, AfterViewInit {
  projects: Project[] = [];
  users: UserInfoModel[] = [];
  roles: Role[] = [];

  selectedProject: Project;
  selectedProjectId: string;

  selectedUser: UserInfoModel;
  selectedUserId: string;

  showList: string = "all-users";

  @ViewChild('filterFormMatTrigger') filterFormMatTrigger: MatMenuTrigger;
  @ViewChild(MatMenuTrigger)
  assignUserFormMatTrigger: MatMenuTrigger;
  @Input() userAddError = '';

  constructor(
    private projectUserService: ProjectUserService,
    private globalService: GlobalService,
    private projectService: ProjectService,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) {
    this.globalService.changeGoal("Projects & Users Module");

    this.projectUserService.projectSelectedObs.subscribe(({ project }) => {
      if (project) {
        this.selectedProject = project;
        this.selectedProjectId = project.id;
        this.showList = "users";
      } else {
        this.selectedProject = null;
        this.selectedProjectId = null;
        this.showList = "all-users";
      }
    });
  }

  ngOnInit() {
    this.getProject();
    this.getRole();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["invite"]) {
        setTimeout(() => {
          this.assignUserFormMatTrigger.openMenu();
          let clean_uri =
            location.protocol + "//" + location.host + location.pathname;
          window.history.replaceState({}, document.title, clean_uri);
        }, 1200);
      }
    });
  }

  private getProject() {
    let orgId = localStorage.getItem(ORGANIZATION_ID);
    this.projectService
      .getAllProjectInfoByOrgId(orgId)
      .subscribe((project: Project[]) => {
        this.projects = project;
      });
  }

  private getRole() {
    this.roleService.getAssignList().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  updateList() {
    let currentProject = this.selectedProject;
    this.getProject();
    this.projectUserService.projectSelected(null);
    this.projectUserService.projectSelected(currentProject);
  }

  modelChangeShowList(e) { }

  closeInfoMsg() {
    this.userAddError = '';
  }

  dashboardClick() {
    this.userAddError = '';
  }

  applyFilter() {
    this.filterFormMatTrigger.closeMenu();
  }

  onFilterCancelClick() {
    this.filterFormMatTrigger.closeMenu();
  }
}
