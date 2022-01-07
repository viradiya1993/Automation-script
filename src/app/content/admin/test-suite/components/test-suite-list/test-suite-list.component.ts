import { Component, OnInit } from "@angular/core";
import { TestSuiteService } from "@app/core/services";
import { TestSuite } from "@app/shared/models";
import * as _ from "lodash";
import { TestSuiteFilterService } from "../../services/test-suite-filter.service";

declare const $: any;

@Component({
  selector: "app-test-suite-list",
  templateUrl: "./test-suite-list.component.html",
  styleUrls: ["./test-suite-list.component.scss"]
})
export class TestSuiteListComponent implements OnInit {
  testSuites: TestSuite[] = [];
  testSuiteToRemove: TestSuite;

  constructor(
    private testSuiteService: TestSuiteService,
    private testSuiteFilterService: TestSuiteFilterService
  ) {
    this.testSuiteService.getTestSuites().subscribe(res => {
      this.testSuites = res.data;
      this.selectDefaultTestSuite();
    });
  }

  ngOnInit() {
    $("#removeTestSuiteConfirmation").on("hide.bs.modal", function() {
      this.testSuiteToRemove = undefined;
    });

    this.testSuiteFilterService.testSuiteAdded$.subscribe(testSuite => {
      this.testSuites.push(testSuite);
      this.selectDefaultTestSuite();
    });

    this.testSuiteFilterService.testSuiteUpdated$.subscribe(testSuite => {
      this.testSuites = _.map(this.testSuites, ts => {
        if (ts.testSuiteId === testSuite.testSuiteId) {
          ts = testSuite;
        }
        return ts;
      });
    });
  }

  selectDefaultTestSuite() {
    if (this.testSuites.length) {
      this.selectedTestSuite(this.testSuites[0]);
    } else {
      this.testSuiteFilterService.testSuiteListEmpty();
    }
  }

  selectedTestSuite(testSuite: TestSuite) {
    this.testSuiteFilterService.testSuiteChanged(testSuite);
  }

  onTestSuiteSaveChange() {
    this.testSuiteService.getTestSuites().subscribe(res => {
      this.testSuites = res.data;
    });
  }

  setTestSuiteToRemove(testSuite: TestSuite) {
    this.testSuiteToRemove = testSuite;
  }

  removeTestSuite(testSuite: TestSuite) {
    this.testSuiteService
      .removeTestSuite(testSuite.testSuiteId)
      .subscribe(() => {
        this.testSuites = _.reject(this.testSuites, [
          "testSuiteId",
          testSuite.testSuiteId
        ]);
        this.selectDefaultTestSuite();
      });
  }
}
