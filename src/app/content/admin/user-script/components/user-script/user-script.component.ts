import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageService, TemplateService, WebsiteService } from '@app/core/services';
import { Locator, NameValuePair, Page, Template, TestScript, TestStep, ValueType, Website } from '@app/shared/models';
import { Status } from "@app/shared/enums";
import { FormArrayValidators } from '@app/shared/validators';
import * as _ from 'lodash';
import { CustomParmasComponent } from '../custom-parmas/custom-parmas.component';

@Component({
  selector: 'app-user-script',
  templateUrl: './user-script.component.html',
  styleUrls: ['./user-script.component.scss']
})
export class UserScriptComponent implements OnInit {
  userScriptForm: FormGroup;
  testScript: TestScript;
  websites: Website[] = [];
  templates: Template[] = [];
  templateTypes: string[] = [];
  pages: Page[] = [];
  columnsToDisplay: string[] = ["select_ahq_2021", "action_ahq_2021"];
  rowData = [];
  globalParameters: NameValuePair[] = [];
  searchTextPS: string;
  selectTemplateType: string;
  currentIndex: number;
  constructor(
    private fb: FormBuilder,
    private websiteService: WebsiteService,
    private templateService: TemplateService,
    private pageService: PageService,
    public dialog: MatDialog,) {

    this.userScriptForm = this.fb.group({
      //storyId: ["", Validators.required],
      name: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      websiteId: ["", Validators.required],
      parameters: this.fb.array([]),
      //tags: [this.tags],
      returnType: ["", Validators.required],
      testSteps: this.fb.array([], FormArrayValidators.minLength(1))
    });

    this.userScriptForm.get("websiteId").valueChanges.subscribe(websiteId => {
      if (websiteId) {
        this.pageService.getPagesByWebsiteId(websiteId).subscribe(pages => {
          this.pages = pages;
          this.testScript?.testSteps?.forEach(testStep => {
            this.addDeletedLocator(testStep);
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.getWebsites();
    this.getTemplete();
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]).controls;
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      const dir = event.currentIndex > event.previousIndex ? 1 : -1;
      const from = event.previousIndex;
      const to = event.currentIndex;
      const testStepFormArray = <FormArray>(
        this.userScriptForm.controls["testSteps"]
      );
      const temp = testStepFormArray.at(from);
      for (let i = from; i * dir < to * dir; i = i + dir) {
        const current = testStepFormArray.at(i + dir);
        testStepFormArray.setControl(i, current);
      }
      testStepFormArray.setControl(to, temp);
    } else {
      const template = event.previousContainer.data[
        event.previousIndex
      ] as Template;
      const testStep: TestStep = {
        testStepId: "",
        templateId: template.templateId,
        templateTitle: template.templateTitle,
        breakpoint: false,
        status: Status.Pending,
        sequence: 0,
        params: {
          number: {
            type: ValueType.Undefined,
            value: ""
          },
          text: {
            type: ValueType.Undefined,
            value: ""
          },
          variable: {
            type: ValueType.Undefined,
            value: ""
          },
          cookie: {
            type: ValueType.Undefined,
            value: ""
          },
          expected: {
            type: ValueType.Undefined,
            value: ""
          },
          test: {
            testScriptId: "",
            name: ""
          },
          file: {
            fileId: "",
            name: "",
            url: ""
          },
          uiLocator: {
            locateBy: "",
            locatorId: "",
            locatorName: "",
            locatorType: "",
            locatorValue: "",
            pageId: ""
          },
          uiTable: {
            locateBy: "",
            locatorId: "",
            locatorName: "",
            locatorType: "",
            locatorValue: "",
            pageId: ""
          }
        }
      };
      this.addTestStep(event.currentIndex, testStep);
    }
  }

  addTestStep(index: number, testStep: TestStep) {
    const testSteps = this.userScriptForm.get("testSteps") as FormArray;
    if (index >= 0 && index <= testSteps.length) {
      const testStepFG = this.fb.group({
        templateId: ["", Validators.required],
        templateTitle: ["", Validators.required],
        params: this.fb.group({
          number: this.fb.group({
            type: [ValueType.Undefined],
            value: [""]
          }),
          text: this.fb.group({
            type: [ValueType.Undefined],
            value: [""]
          }),
          variable: this.fb.group({
            type: [ValueType.Undefined],
            value: [""]
          }),
          password: this.fb.group({
            type: [ValueType.Undefined],
            value: [""]
          }),
          cookie: this.fb.group({
            type: [ValueType.Undefined],
            value: [""]
          }),
          expected: this.fb.group({
            type: [ValueType.Undefined],
            value: [""]
          }),
          file: this.fb.group({
            fileId: [""],
            name: [""],
            url: [""]
          }),
          uiLocator: this.fb.group({
            locatorId: [""],
            pageId: [""],
            deleted: false
          }),
          uiTable: this.fb.group({
            locatorId: [""],
            pageId: [""]
          })
        })
      });
      testStepFG.patchValue(testStep);
      this.addDeletedLocator(testStep);
      testSteps.insert(index, testStepFG);
    }
  }

  deleteTestStep(index: number) {
    const testSteps = this.userScriptForm.get("testSteps") as FormArray;
    testSteps.removeAt(index);
  }

  addColumn(columnName: string) {
    if (
      this.columnsToDisplay.findIndex(colName => colName === columnName) === -1
    ) {
      this.columnsToDisplay.splice(this.columnsToDisplay.length, 0, columnName);
    }
  }

  removeColumn(columnName: string) {
    if (!this.onlyOneOccurance(columnName)) {
      return;
    }

    this.columnsToDisplay = _.reject(this.columnsToDisplay, function (
      displayedColumn
    ) {
      return displayedColumn === columnName;
    });

    if (this.columnsToDisplay.length > 2) {
      this.rowData = _.map(this.rowData, row => {
        return _.omit(row, columnName);
      });
    } else if (this.columnsToDisplay.length === 2) {
      this.rowData = [];
    }
  }

  removeAllColumns() {
    this.columnsToDisplay = ["select_ahq_2021", "action_ahq_2021"];
    this.rowData = [];
  }

  getDataColumns() {
    return _.reject(
      [...this.columnsToDisplay],
      col =>
        col === "id_ahq_2021" ||
        col === "edit_ahq_2021" ||
        col === "select_ahq_2021" ||
        col === "action_ahq_2021"
    );
  }

  onlyOneOccurance(columnName: string) {
    const ts = this.userScriptForm.value as TestScript;
    let cnt = 0;
    ts.testSteps.forEach(step => {
      if (
        step.params &&
        ((step.params.text && step.params.text.value === columnName) ||
          (step.params.number && step.params.number.value === columnName) ||
          (step.params.variable && step.params.variable.value === columnName) ||
          (step.params.cookie && step.params.cookie.value === columnName) ||
          (step.params.expected && step.params.expected.value === columnName))
      ) {
        cnt++;
      }
    });
    return cnt === 1;
  }

  private addDeletedLocator(testStep: TestStep) {
    // add selected and deleed locator in list to show it strikethrough
    if (testStep.params?.uiLocator?.deleted) {
      const uiLocator: Locator = testStep.params?.uiLocator;
      const page = this.pages.find(item => item.pageId === uiLocator.pageId);
      if (page && !page.locators?.some(item => item.locatorId === "")) {
        page.locators.push({
          locatorId: "",
          locatorName: uiLocator.locatorName,
          pageId: page.pageId,
          locateBy: null,
          locatorType: null,
          locatorValue: null,
          deleted: true
        });
      }
    }
  }

  getDisplayTemplateTitle(templateTitle: string) {
    let displayTemplateTitle = "";
    const keywords = templateTitle.split(" ");

    keywords.forEach(keyword => {
      if (keyword === "{{text}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">text</span>';
      } else if (keyword === "{{number}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">number</span>';
      } else if (keyword === "{{variable}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">variable</span>';
      } else if (keyword === "{{cookie}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">cookie</span>';
      } else if (keyword === "{{ui-locator}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-primary">ui-locator</span>';
      } else if (keyword === "{{ui-table}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-primary">ui-table</span>';
      } else if (keyword === "{{Test}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">Test</span>';
      } else if (keyword === "{{expected}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">expected</span>';
      } else if (keyword === "{{file}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">file</span>';
      } else if (keyword === "{{password}}") {
        displayTemplateTitle =
          displayTemplateTitle +
          ' <span class="badge badge-danger">password</span>';
      } else {
        displayTemplateTitle = displayTemplateTitle + " " + keyword;
      }
    });

    return displayTemplateTitle;
  }


  //websites list
  getWebsites() {
    this.websiteService.getWebsites(0).subscribe((websites: any) => {
      if (websites) {
        this.websites = websites;
      }
    });
  }

  //Templete 
  getTemplete() {
    this.templateService.getTemplatesByTitle("").subscribe((templatesRes: any) => {
      if (templatesRes) {
        this.templates = templatesRes;
        this.templateTypes = _.map(_.uniqBy(this.templates, "type"), "type");
      }
    });
  }

  //Parameter Form array
  getParametersFormArray() {
    return this.userScriptForm.get("parameters") as FormArray;
  }

  //Add parameter
  addParamter(undefined) {
    this.currentIndex = this.getParametersFormArray().controls.length;
    this.getParametersFormArray().push(
      this.fb.group({
        parmsName: ['', Validators.required],
        paramsType: ['', Validators.required]
      })
    );
  }

  //Remove parmas index
  removeParams(index: number, item: FormControl) {
    this.getParametersFormArray().removeAt(index);
  }

  //Add custome params
  AddCustomeParams() { 
    const dialogRef = this.dialog.open(CustomParmasComponent, {
      width: '1000px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  //Save user script
  onUserScriptSaveClick(isExecute = false) { }

  //Cancel user script
  onUserScriptCancelClick() { }
}
