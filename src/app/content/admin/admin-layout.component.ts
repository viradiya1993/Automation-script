import { filter } from "rxjs/operators";
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs";
import { Location, PopStateEvent } from "@angular/common";

import { NavbarComponent } from "@shared/components";
import PerfectScrollbar from "perfect-scrollbar";

declare const $: any;

@Component({
  selector: "app-layout",
  templateUrl: "./admin-layout.component.html",
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  url: string;
  location: Location;

  @ViewChild("sidebar") sidebar: any;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor(private router: Router, location: Location) {
    this.location = location;
  }

  ngOnInit() {
    const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
    const elemSidebar = <HTMLElement>(
      document.querySelector(".sidebar .sidebar-wrapper")
    );
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this._router = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        if (elemSidebar) {
          elemSidebar.scrollTop = 0;
        }
      });
    const html = document.getElementsByTagName("html")[0];
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      if (elemSidebar) {
        ps = new PerfectScrollbar(elemSidebar);
      }
      html.classList.add("perfect-scrollbar-on");
    } else {
      html.classList.add("perfect-scrollbar-off");
    }
    this._router = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.navbar.sidebarClose();
      });
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  public isMap() {
    if (
      this.location.prepareExternalUrl(this.location.path()) ===
      "/maps/fullscreen"
    ) {
      return true;
    } else {
      return false;
    }
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      let ps = new PerfectScrollbar(elemMainPanel);
      if (elemSidebar) {
        ps = new PerfectScrollbar(elemSidebar);
      }
      ps.update();
    }
  }

  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
}
