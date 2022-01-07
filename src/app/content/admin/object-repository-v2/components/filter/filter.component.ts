import { Component, OnInit } from "@angular/core";
import { Website } from "@app/shared/models";
import { ObjectRepositoryV2Service } from "../../services/object-repository-v2.service";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
})
export class FilterComponent implements OnInit {
  selectWebsite: Website;
  isFilterApplied: boolean = false;

  constructor(private objectRepositoryV2Service: ObjectRepositoryV2Service) {
    this.objectRepositoryV2Service.websiteSelectedEvent.subscribe((website) => {
      console.log(website,'web');
      
      this.selectWebsite = website;
      this.isFilterApplied = true;
    });
  }

  ngOnInit() {}

  removeFilter() {
    this.selectWebsite = null;
    this.isFilterApplied = false;
    this.objectRepositoryV2Service.websiteSelectedEvent.emit(null);
  }
}
