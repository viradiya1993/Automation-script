import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Browser, Environment, GlobalParameters, GPCustomProperty, Grid } from '@app/shared/models';
import { GlobalParametersService, NotificationService, EnvironmentService, BrowserService, GridService } from '@app/core/services';

@Component({
  selector: 'app-global-parameters',
  templateUrl: './global-parameters.component.html',
  styleUrls: ['./global-parameters.component.scss']
})
export class GlobalParametersComponent implements OnInit, AfterViewInit {

  environments: Environment[] = [];
  browsers: Browser[] = [];
  grids: Grid[] = [];
  globalParameters: GlobalParameters;
  globalParametersForm: FormGroup;

  constructor(private fb: FormBuilder, private environmentService: EnvironmentService,
    private browserService: BrowserService,
    private notificationService: NotificationService,
    private globalParametersService: GlobalParametersService,
    private gridService: GridService) {

    this.environmentService.getEnvironments().subscribe(res => {
      this.environments = res.data;
    });

    this.browserService.getBrowsers().subscribe(res => {
      this.browsers = res.data;
    });

    this.gridService.getGrids().subscribe(res => {
      this.grids = res.data;
    });

    this.globalParametersForm = this.fb.group({
      baseUrl: ['', Validators.required],
      browser: ['', Validators.required],
      gridUrl: ['', Validators.required],
      type: ['', Validators.required],
      screenshotAfterEachStep: [false, Validators.required],
      screenshotOnError: [true, Validators.required],
      screenshotOnFinish: [true, Validators.required],
      closeBrowserAfterEachExecution: [true, Validators.required],
      timeout: [0, Validators.required],
      waitForElementTimeout: [0, Validators.required],
      customProperties: this.fb.array([])
    });

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.globalParametersService.getGlobalParameters().subscribe(globalParameters => {
      this.globalParameters = globalParameters;
      this.globalParametersForm.patchValue(this.globalParameters);
      this.globalParameters.customProperties.forEach((customProperty) => {
        this.addCustomPropertyFG(customProperty);
      });
    });
  }

  getCustomPropertiesFA() {
    return this.globalParametersForm.get('customProperties') as FormArray;
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

  removeCustomPropertyFG(index: number) {
    this.getCustomPropertiesFA().removeAt(index);
  }

  onGlobalParametersSaveClick() {
    console.log(this.globalParametersForm.value);
    this.globalParameters = { ...this.globalParameters, ...this.globalParametersForm.value };

    if (this.globalParameters.globalParameterId) {
      this.globalParametersService.updateGlobalParameters(this.globalParameters).subscribe(res => {
        this.notificationService.showNotification('Global Parameters saved successfully', '', 'top', 'center');
      });
    } else {
      this.globalParametersService.addGlobalParameters(this.globalParameters).subscribe(res => {
        this.notificationService.showNotification('Global Parameters saved successfully', '', 'top', 'center');
      });
    }
  }
}