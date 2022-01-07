import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material/menu';
import { GlobalParametersService, NotificationService, TestBotService } from '@app/core/services';
import { GPCustomProperty, TestBot } from '@app/shared/models';

@Component({
  selector: 'app-test-bot-form',
  templateUrl: './test-bot-form.component.html',
  styleUrls: ['./test-bot-form.component.scss']
})
export class TestBotFormComponent implements OnInit {

  @ViewChild('testBotFormMatTrigger') testBotFormMatTrigger: MatMenuTrigger;
  @Output() testBotSaveChange = new EventEmitter();

  testBot: TestBot = {
    configuration: {
      globalParameterId: undefined,
      organizationId: undefined,
      projectId: undefined,
      baseUrl: undefined,
      browser: undefined,
      gridUrl: undefined,
      type: undefined,
      screenshotAfterEachStep: false,
      screenshotOnError: false,
      screenshotOnFinish: false,
      closeBrowserAfterEachExecution: false,
      timeout: 0,
      waitForElementTimeout: 0,
      customProperties: [],
      createdBy: undefined,
      createdDate: undefined,
      updatedBy: undefined,
      updatedDate: undefined
    },
    createdBy: undefined,
    createdDate: undefined,
    description: undefined,
    name: undefined,
    organizationId: undefined,
    projectId: undefined,
    testBotId: undefined,
    testSuites: [],
    updatedBy: undefined,
    updatedDate: undefined
  };
  testBotForm: FormGroup;

  constructor(private fb: FormBuilder, private testBotService: TestBotService,
    private notificationService: NotificationService, private globalParametersService: GlobalParametersService) {
    this.testBotForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
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
  }

  ngOnInit() {
    if (this.testBot.testBotId) {
      this.testBotForm.patchValue(this.testBot, { emitEvent: false });
      this.testBot.configuration.customProperties.forEach((customProperty) => {
        this.addCustomPropertyFG(customProperty);
      });
    }
  }

  onChangeDefaultConfiguration(ob: MatCheckboxChange) {
    let configurationFG = this.testBotForm.get('configuration') as FormGroup;
    if (ob.checked) {
      this.globalParametersService.getGlobalParameters().subscribe(globalParameters => {
        configurationFG.patchValue(globalParameters);
        globalParameters.customProperties.forEach((customProperty) => {
          this.addCustomPropertyFG(customProperty);
        });
      });
    } else {
      configurationFG.patchValue({
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
        customProperties: []
      });
      configurationFG.setControl('customProperties', this.fb.array([]));
    }
  }

  getCustomPropertiesFA() {
    let configurationFG = this.testBotForm.get('configuration') as FormGroup;
    return configurationFG.controls['customProperties'] as FormArray;
  }

  addCustomPropertyFG(customProperty: GPCustomProperty) {
    this.getCustomPropertiesFA().push(
      this.fb.group({
        customPropertyId: [customProperty ? customProperty.customPropertyId : ''],
        name: [customProperty ? customProperty.name : '', Validators.required],
        value: [customProperty ? customProperty.value : '', Validators.required]
      })
    );
  }

  onTestBotCancelClick() {
    this.testBotForm.reset();
    this.testBotFormMatTrigger.closeMenu();
  }

  onTestBotSaveClick() {
    this.testBot = { ...this.testBot, ...this.testBotForm.value };
    console.log(this.testBot);
    if (this.testBot.testBotId) {
      this.testBotService.updateTestBot(this.testBot).subscribe(() => {
        this.testBotForm.reset();
        this.testBot = null;
        this.notificationService.showNotification('Test Bot updated successfully', '', 'top', 'right');
        this.testBotFormMatTrigger.closeMenu();
        this.testBotSaveChange.emit(null);
      });
    } else {
      this.testBotService.addTestBot(this.testBot).subscribe((result) => {
        this.testBotForm.reset();
        this.testBot = null;
        this.notificationService.showNotification('Test Bot created successfully', '', 'top', 'right');
        this.testBotFormMatTrigger.closeMenu();
        this.testBotSaveChange.emit(null);
      });
    }
  }

}
