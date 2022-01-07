import { Injectable } from '@angular/core';
import { TestBotExecutorService } from '@app/core/services';
import { ConsolidatedExecution, TestResultsFilter } from '@app/shared/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultsFilterService {

  private filterSource = new Subject();
  private testResultsFilterSource = new Subject<ConsolidatedExecution[]>();

  testResultsFilterUpdated$ = this.testResultsFilterSource.asObservable();
  filterUpdated$ = this.filterSource.asObservable();

  readonly defaultFilter: TestResultsFilter = {
    testBotId: '',
    releaseId: '',
    offset: 0,
    size: 10
  };

  

  appliedFilter: any = {
    testBot: undefined,
    release: undefined
  }

  constructor(private testBotExecutorService: TestBotExecutorService) { }

  setTestBotAndFilter(testBot: any) {
    this.appliedFilter.testBot = testBot;
    this.appliedFilter.release = undefined;
    this.filterSource.next();
  }

  filter() {
    return this.testBotExecutorService.getConsolidatedExecutionsByTestBotId(this.getFilterObj().testBotId, this.getFilterObj().offset, this.getFilterObj().size);
  }

  getFilterObj() {
    let filter = this.defaultFilter;
    if (this.appliedFilter.testBot) {
      filter.testBotId = this.appliedFilter.testBot.testBotId;
    } else {
      filter.testBotId = "";
    }
    return filter;
  }
}