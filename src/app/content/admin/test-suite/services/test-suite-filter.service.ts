import { Injectable } from '@angular/core';
import { TestSuite } from '@app/shared/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestSuiteFilterService {

  private filterSource = new Subject();
  private testSuiteChangedSource = new Subject<TestSuite>();
  private testSuiteAddedSource = new Subject<TestSuite>();
  private testSuiteUpdatedSource = new Subject<TestSuite>();
  private testSuiteListEmptySource = new Subject<TestSuite>();

  filterUpdated$ = this.filterSource.asObservable();
  testSuiteChanged$ = this.testSuiteChangedSource.asObservable();
  testSuiteAdded$ = this.testSuiteAddedSource.asObservable();
  testSuiteUpdated$ = this.testSuiteUpdatedSource.asObservable();
  testSuiteListEmpty$ = this.testSuiteListEmptySource.asObservable();

  constructor() { }

  testSuiteChanged(testSuite: TestSuite) {
    this.testSuiteChangedSource.next(testSuite);
  }

  testSuiteAdded(testSuite: TestSuite) {
    this.testSuiteAddedSource.next(testSuite);
  }

  testSuiteUpdated(testSuite: TestSuite) {
    this.testSuiteUpdatedSource.next(testSuite);
  }

  testSuiteListEmpty() {
    this.testSuiteListEmptySource.next();
  }
}
