import { Injectable } from "@angular/core";
import { SchedulerService } from "@app/core/services";
import { SchedulerResourceType, TestBotTab } from "@app/shared/enums";
import { TestBotFilter } from "@app/shared/models";
import { Subject } from "rxjs";
import { TestResultsFilterService } from "../../test-results/services/test-results-filter.service";

@Injectable()
export class TestBotFilterService {
  selectedTab: TestBotTab = TestBotTab.TestResults;

  private filterSource = new Subject();
  filterUpdated$ = this.filterSource.asObservable();

  private refreshTestBotDetailsSource = new Subject();
  refreshTestBotDetailsUpdated$ = this.refreshTestBotDetailsSource.asObservable();

  private refreshSchedulersSource = new Subject();
  refreshSchedulersUpdated$ = this.refreshSchedulersSource.asObservable();

  readonly defaultFilter: TestBotFilter = {
    testBotId: "",
    offset: 0,
    size: 10
  };

  appliedFilter: any = {
    testBot: undefined
  };

  constructor(
    private testResultsFilterService: TestResultsFilterService,
    private schedulerService: SchedulerService
  ) {}

  filter() {
    if (this.selectedTab === TestBotTab.TestResults) {
      this.testResultsFilterService.setTestBotAndFilter(
        this.appliedFilter.testBot
      );
    } else if (this.selectedTab === TestBotTab.TestBotDetails) {
      this.refreshTestBotDetailsSource.next();
    } else if (this.selectedTab === TestBotTab.Schedulers) {
      this.schedulerService.appliedFilter.resourceId = this.appliedFilter.testBot.testBotId;
      this.schedulerService.appliedFilter.resourceType = SchedulerResourceType.TestBot;
      console.log(this.appliedFilter.testBot.testBotId,'testBotId test bot service');
      this.schedulerService.filter();
      this.refreshSchedulersSource.next();
    
    }
  }
}
