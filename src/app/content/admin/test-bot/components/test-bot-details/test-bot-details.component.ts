import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserService, EnvironmentService, GridService, NotificationService, TestBotService } from '@app/core/services';
import { Browser, Environment, GPCustomProperty, Grid, TestBot, TestSuiteView } from '@app/shared/models';
import * as _ from 'lodash';
import { TestBotFilterService } from '../../services/test-bot-filter.service';
import { TestBotTab } from '@app/shared/enums';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-test-bot-details',
  templateUrl: './test-bot-details.component.html',
  styleUrls: ['./test-bot-details.component.scss']
})
export class TestBotDetailsComponent implements OnInit {

  testBot: TestBot;
  testBotForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: '',
    testSuites: this.fb.array([]),
    configuration: this.fb.group({
      baseUrl: '',
      browser: '',
      gridUrl: '',
      type: '',
      screenshotAfterEachStep: false,
      screenshotOnError: false,
      screenshotOnFinish: false,
      closeBrowserAfterEachExecution: false,
      timeout: 0,
      waitForElementTimeout: 0,
      customProperties: this.fb.array([])
    })
  });
  testSuites: TestSuiteView[] = [];
  environments: Environment[] = [];
  browsers: Browser[] = [];
  grids: Grid[] = [];
  searchTextTS: string = "";

  constructor(private fb: FormBuilder, private testBotService: TestBotService, private gridService: GridService,
    private environmentService: EnvironmentService, private browserService: BrowserService,
    private testBotFilterService: TestBotFilterService,
    private notificationService: NotificationService) {

    this.environmentService.getEnvironments().subscribe(res => {
      this.environments = res.data;
    });

    this.browserService.getBrowsers().subscribe(res => {
      this.browsers = res.data;
    });

    this.gridService.getGrids().subscribe(res => {
      this.grids = res.data;
    });
  }

  ngOnInit() {
    this.getTestBot();
    this.testBotFilterService.refreshTestBotDetailsUpdated$.subscribe(() => {
      if (this.testBotFilterService.selectedTab === TestBotTab.TestBotDetails) {
        this.getTestBot();
      }
    });
  }

  ngAfterViewInit() {
    return this.testBotService.getTestSuites().subscribe(result => this.testSuites = result.data);
  }

  getTestSuiteFormArray() {
    return this.testBotForm.get('testSuites') as FormArray;
  }

  onTestBotSaveClick() {
    console.log(this.testBotForm.getRawValue());
    this.testBot = { ...this.testBot, ...this.testBotForm.getRawValue() };
    if (this.testBot.testBotId) {
      this.testBotService.updateTestBot(this.testBot).subscribe(() => {
        this.notificationService.showNotification('Test Bot updated successfully', '', 'top', 'right');
      });
    } else {
      this.testBotService.addTestBot(this.testBot).subscribe(() => {
        this.notificationService.showNotification('Test Bot created successfully', '', 'top', 'right');
      });
    }
  }

  addTestSuiteToTestBot(testSuite: TestSuiteView) {
    if (_.find(this.getTestSuiteFormArray().value, { 'testSuiteId': testSuite.testSuiteId })) {
      console.log("Already added.")
    }
    else {
      this.getTestSuiteFormArray().push(
        this.fb.group({
          testSuiteId: [testSuite.testSuiteId, Validators.required],
          name: [testSuite.name, Validators.required],
          numberOfTestScripts: [testSuite.numberOfTestScripts, Validators.required],
        }));
    }
  }

  removeTestSuiteFromTestBot(index: number) {
    this.getTestSuiteFormArray().removeAt(index);
  }

  getCustomPropertiesFA() {
    let configurationFG = this.testBotForm.get('configuration') as FormGroup;
    return configurationFG.controls['customProperties'] as FormArray;
  }

  addCustomPropertyFG(customProperty: GPCustomProperty) {
    this.getCustomPropertiesFA().push(
      this.fb.group({
        customPropertyId: [customProperty ? customProperty.customPropertyId : ''],
        name: [{ value: customProperty ? customProperty.name : '', disabled: true }, Validators.required],
        value: [customProperty ? customProperty.value : '', Validators.required]
      })
    );
  }

  removeCustomPropertyFG(index: number) {
    this.getCustomPropertiesFA().removeAt(index);
  }

  getTestBot() {
    if (this.testBotFilterService.appliedFilter.testBot) {
      this.testBotForm.reset();
      this.testBotForm.setControl('testSuites', this.fb.array([]));
      this.testBotService
        .getTestBot(this.testBotFilterService.appliedFilter.testBot.testBotId)
        .subscribe((testBot) => {
          this.testBot = testBot;
          this.testBotForm.patchValue(this.testBot);
          if (this.testBot.configuration) {
            this.testBot.configuration.customProperties.forEach((customProperty) => {
              this.addCustomPropertyFG(customProperty);
            });
          }
          this.testBot.testSuites.forEach(testSuite => {
            this.addTestSuiteToTestBot(testSuite);
          });
        });
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      const dir = event.currentIndex > event.previousIndex ? 1 : -1;
      const from = event.previousIndex;
      const to = event.currentIndex;
      const testSuiteFA = this.getTestSuiteFormArray();
      const temp = testSuiteFA.at(from);
      for (let i = from; i * dir < to * dir; i = i + dir) {
        const current = testSuiteFA.at(i + dir);
        testSuiteFA.setControl(i, current);
      }
      testSuiteFA.setControl(to, temp);
    } else {
      const selectedTestSuite = event.previousContainer.data[
        event.previousIndex
      ] as TestSuiteView;
      const testSuite = {
        testSuiteId: selectedTestSuite.testSuiteId,
        name: selectedTestSuite.name,
        numberOfTestScripts: selectedTestSuite.numberOfTestScripts
      } as TestSuiteView;
      this.addTestSuiteToTestBot(testSuite);
      (event.currentIndex, testSuite);
    }
  }
}
