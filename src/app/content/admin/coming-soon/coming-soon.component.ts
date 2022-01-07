import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

declare const $: any;
@Component({
  selector: "coming-soon",
  templateUrl: "./coming-soon.component.html",
  styleUrls: ["./coming-soon.component.scss"],
})
export class ComingSoonComponent implements OnInit {
  currentRoute: string;

  constructor(private router: Router) {}

  ngOnInit() {
    // this.router.events
    //   .filter((event) => event instanceof NavigationEnd)
    //   .subscribe((event: any) => {
    //     console.log(event);
    //     this.currentRoute = event.url;
    //   });

    // $(".sidebar-wrapper")
    //   .find(".collapse.show")
    //   .parent()
    //   .find("a")
    //   .addClass("collapsed")
    //   .attr("aria-expanded", true);
    // $(".sidebar-wrapper").find(".collapse.show").addClass("show");
  }
}
