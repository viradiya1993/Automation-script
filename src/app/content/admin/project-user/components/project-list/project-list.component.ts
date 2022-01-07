import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
import { toggleResponse } from "@app/core/helpers";
import { ProjectService } from "@app/core/services";
import { MessageService } from "@app/shared/components";
import { ORGANIZATION_ID, SELECTED_PROJECT } from "@app/shared/configs";
import { Project } from "@app/shared/models";
import { ProjectUserService } from "../../services/project-user.service";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  projects: Project[] = [];
  selectedProject: Project = null;
  deletedProject: Project = null;
  panelOpenState = false;

  @ViewChild(MatMenuTrigger) projectFormMatTrigger: MatMenuTrigger;

  constructor(
    private projectUserService: ProjectUserService,
    private projectService: ProjectService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getProject();

    this.projectUserService.projectCreatedObs.subscribe(({ project }) => {
      this.getProject();
    });

    this.projectUserService.projectUpdatedObs.subscribe(({ project }) => {
      this.getProject();
    });

    this.projectUserService.projectDeletedObs.subscribe(({ project }) => {
      this.getProject();
    });

    this.projectUserService.userAssignObs.subscribe(({ projectId, user }) => {
      this.getProject();
    });
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["project"]) {
        setTimeout(() => {
          this.projectFormMatTrigger.openMenu();
          // this.router.navigate([], {});
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

  addProject() {
    this.projectFormMatTrigger.openMenu();
  }

  onProjectSelect(project: Project, event) {
    localStorage.removeItem(SELECTED_PROJECT);
    localStorage.setItem(SELECTED_PROJECT, JSON.stringify(project));
    this.projectUserService.projectSelected(project);
  }

  onProjectEdit(project: Project) {
    this.selectedProject = project;
  }

  setProjectToRemove(project: Project) {
    this.deletedProject = project;
  }

  removeProject(project: Project) {
    this.projectService.delete(project.id).subscribe((data) => {
      this.deletedProject = null;
      this.projectUserService.projectDeleted(project);
      toggleResponse(this.messageService, data);
    });
  }
}
