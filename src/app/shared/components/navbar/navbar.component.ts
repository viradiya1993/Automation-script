import { Location } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatSelect } from "@angular/material/select";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ProjectService } from "@app/core/services";
import {
  GlobalService,
  LocalStorageService,
  OrganizationService,
} from "@core/services";
import { MENUITEM } from "@shared/configs";
import { SUBSCRIBER } from "@shared/configs/roles";
import { Menu } from "@shared/models/menu.model";
import { Project } from "@shared/models/project.model";
import { finalize } from "rxjs/operators";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/filter";

import { UserService } from "./../../../core/services/user.service";
import { AHQ_SUPPORT } from "./../../configs/roles";
import { OrganizationModal } from "./../../models/organization.model";

const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

declare var $: any;
@Component({
  selector: "app-navbar-cmp",
  templateUrl: "navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  listTitles: Menu[] = MENUITEM;
  location: Location;
  mobile_menu_visible: any = 0;
  private nativeElement: Node;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private _router: Subscription;
  header: any;
  @ViewChild("app-navbar-cmp") button: any;
  userData: any = JSON.parse(localStorage.getItem("user"));

  public isProjectsLoading = false;
  projects: Project[] = [];
  organizations: OrganizationModal[] = [];
  selectedProject: any = "all";
  selectedOrganization: any = null;
  orgName: string = null;
  offset = 0;
  limit = 10;
  total = 100;
  options = [];
  optionCount = 0;
  private readonly RELOAD_TOP_SCROLL_POSITION = 100;
  @ViewChild("projectSelect") selectElem: MatSelect;

  constructor(
    location: Location,
    private element: ElementRef,
    private localService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    private userService: UserService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;

    this.globalService.goal.subscribe((res) => {
      this.header = res;
    });
  }

  minimizeSidebar() {
    const body = document.getElementsByTagName("body")[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove("sidebar-mini");
      misc.sidebar_mini_active = false;
    } else {
      setTimeout(function () {
        body.classList.add("sidebar-mini");
        misc.sidebar_mini_active = true;
        $(".sidebar-wrapper").find(".collapse").removeClass("show");
        $(".sidebar-wrapper")
          .find(".collapse")
          .parent()
          .find("a")
          .attr("aria-expanded", false);
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  hideSidebar() {
    const body = document.getElementsByTagName("body")[0];
    const sidebar = document.getElementsByClassName("sidebar")[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove("hide-sidebar");
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove("animation");
      }, 600);
      sidebar.classList.add("animation");
    } else {
      setTimeout(function () {
        body.classList.add("hide-sidebar");
        // $('.sidebar').addClass('animation');
        misc.hide_sidebar_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  registerPanelScrollEvent() {
    const panel = this.selectElem.panel.nativeElement;
    panel.addEventListener("scroll", (event) => this.loadAllOnScroll(event));
  }

  loadAllOnScroll(event) {
    if (event.target.scrollTop > this.RELOAD_TOP_SCROLL_POSITION) {
      let obj = this.projects.slice(this.offset, this.offset + this.limit);
      obj.forEach((item, key) => {
        this.options.push(item);
      });
      this.offset += this.limit;
    }
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];

    if (body.classList.contains("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    }

    let role = JSON.parse(localStorage.getItem("user-role"));

    if (!role) {
      this.userRole();
    }

    if (role && role.roleId == AHQ_SUPPORT) {
      if (this.organizations.length == 0) {
        this.organizationService.index().subscribe((res: any) => {
          this.organizations = res;
        });
      }

      this.projectOrganization();

      this.selectedOrganization = localStorage.getItem("organizationId");
      this.selectedProject = localStorage.getItem("projectId");
    } else {
      let organization = JSON.parse(localStorage.getItem("organization"));
      if (organization) {
        this.orgName = organization.orgName;
      }

      if (role && role.roleId == SUBSCRIBER) {
        this.projectOrganization();
      } else {
        this.projectRequest();
      }

      if (localStorage.getItem("projectId")) {
        this.selectedProject = localStorage.getItem("projectId");
      } else {
        let users = JSON.parse(localStorage.getItem("user"));
        if (users && users.selectedProject) {
          this.projects = users.selectedProject;
          this.checkSelectFirstProject();
        }
      }
    }

    if (body.classList.contains("hide-sidebar")) {
      misc.hide_sidebar_active = true;
    }

    this._router = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        const $layer = document.getElementsByClassName("close-layer")[0];
        if ($layer) {
          $layer.remove();
        }
      });
  }

  public projectOrganization() {
    if (localStorage.getItem("organizationId")) {
      this.isProjectsLoading = true;
      this.projectService
        .getAllActiveProjectInfoByOrgId(localStorage.getItem("organizationId"))
        .pipe(finalize(() => (this.isProjectsLoading = false)))
        .subscribe((res) => {
          this.projects = res.filter((item: Project) => item.isEnabled);
          this.options = res
            .filter((item: Project) => item.isEnabled)
            .slice(this.offset, this.limit);
          this.offset += this.limit;
          this.checkSelectFirstProject();
        });
    }
  }

  projectRequest() {
    this.projectService
      .getProjectInfoByUserId(this.userData.userId, 0)
      .pipe(finalize(() => (this.isProjectsLoading = false)))
      .subscribe((res) => {
        this.projects = res.filter((item: Project) => item.isEnabled);
        this.options = res
          .filter((item: Project) => item.isEnabled)
          .slice(this.offset, this.limit);
        this.offset += this.limit;
        this.checkSelectFirstProject();
      });
  }

  private checkSelectFirstProject() {
    // If no prject is selected then select first project from dropdown
    if (
      (!this.selectedProject || this.selectedProject === "all") &&
      this.projects.length
    ) {
      this.selectedProject = this.projects[0].id;
      this.projectChange(this.selectedProject);
    }
  }

  onResize(event) {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  projectChange(project) {
    let user = JSON.parse(localStorage.getItem("user"));
    let role = JSON.parse(localStorage.getItem("user-role"));
    if (role && role.roleId != AHQ_SUPPORT) {
      this.userService.updateSelectedProject(project, user.userId).subscribe();
    }
    localStorage.setItem("projectId", project);
    // this.userRole(project);
    this.refreshButton();
  }

  userRole(project = null) {
    let user = JSON.parse(localStorage.getItem("user"));
    this.userService.getUserRole(project, user.userId).subscribe((res: any) => {
      localStorage.setItem("user-role", JSON.stringify(res));
      this.refreshButton();
    });
  }

  organizationChange(organization) {
    this.projects = [];
    localStorage.setItem("organizationId", "all");
    localStorage.removeItem("projectId");
    if (organization) {
      this.organizationService.show(organization).subscribe((res: any) => {
        localStorage.setItem("organizationId", organization);
        localStorage.setItem("organization", JSON.stringify(res));
        this.selectedOrganization = organization;
        this.selectedProject = "all";
        // this.projectOrganization();
        this.refreshButton();
      });
    }
  }

  refreshButton() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([this.getPath()], {});
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    var $toggle = document.getElementsByClassName("navbar-toggler")[0];
    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }

      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    if (this.header.title !== undefined) {
      return this.header.title;
    }
    return this.header;
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  logout() {
    this.localService.removeLogin();
    this.router.navigate(["auth/login"]);
  }
}
