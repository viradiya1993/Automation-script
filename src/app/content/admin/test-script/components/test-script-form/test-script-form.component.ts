import { TestScriptHandlerService } from "./../../services/test-script-handler.service";
import {
  Component,
  OnInit,
  SimpleChanges,
  OnChanges,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import {
  TestScript,
  TestStep,
  Template,
  Website,
  Page,
  ValueType,
  NameValuePair,
  EpicMapView,
  StoryMapView,
  Params
} from "@app/shared/models";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { MatChipInputEvent } from "@angular/material/chips";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  EpicService,
  NotificationService,
  PageService,
  TestScriptService
} from "@app/core/services";
import { Status } from "@app/shared/enums";
import { FormArrayValidators } from "@app/shared/validators";
import { Locator } from "@shared/models/locator.model";
import * as _ from "lodash";
import { of } from "rxjs";
import { debounceTime, finalize, switchMap, tap } from "rxjs/operators";
import { Guid } from "guid-typescript";
import { FilterService } from "../../services/filter.service";
import { SelectionModel } from "@angular/cdk/collections";
import * as XLSX from "xlsx";

@Component({
  selector: "app-test-script-form",
  templateUrl: "./test-script-form.component.html",
  styleUrls: ["./test-script-form.component.scss"]
})
export class TestScriptFormComponent implements OnInit, OnChanges  {
  mode: string;
  storyId: string;
  testScriptId: string;
  testScript: TestScript;
  testScriptForm: FormGroup;
  templates: Template[] = [];
  templateTypes: string[] = [];
  searchTextPS: string;
  selectTemplateType: string;

  searchStoriesCtrl = new FormControl("", [Validators.required]);
  isLoading = false;

  websites: Website[] = [];
  pages: Page[] = [];
  epics: EpicMapView[] = [];

  tags: string[] = [];

  globalParameters: NameValuePair[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  columnsToDisplay: string[] = ["select_ahq_2021", "action_ahq_2021"];
  rowData = [];
  newRow = { id_ahq_2021: "", edit_ahq_2021: false };
  editRows = [];
  selection = new SelectionModel<any>(true, []);

  @ViewChild("inputImportFile") inputImportFile: ElementRef;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private pageService: PageService,
    private epicService: EpicService,
    private testScriptService: TestScriptService,
    private filterService: FilterService,
    private testScriptHandler: TestScriptHandlerService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data) {
      this.mode = this.data.mode;
      this.storyId = this.data.storyId;
      this.testScriptId = this.data.testScriptId;
      this.templates = this.data.templates;
      this.templateTypes = _.map(_.uniqBy(this.templates, "type"), "type");
      this.websites = this.data.websites;
      this.globalParameters = this.data.globalParameters as NameValuePair[];
    }

    this.testScriptForm = this.fb.group({
      storyId: ["", Validators.required],
      name: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      websiteId: ["", Validators.required],
      tags: [this.tags],
      testSteps: this.fb.array([], FormArrayValidators.minLength(1))
    });

    this.testScriptForm.get("websiteId").valueChanges.subscribe(websiteId => {
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

  ngOnInit() {
    if (this.storyId) {
      this.testScriptForm.patchValue(
        { storyId: this.storyId },
        { emitEvent: false }
      );
    }

    this.searchStoriesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.epics = [];
        }),
        switchMap(filterValue => {
          if (typeof filterValue === "string" && filterValue.length > 0) {
            this.isLoading = true;
            return this.epicService.getEpicsByName("", filterValue).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe(res => {
        if (!res) {
          this.epics = [];
        } else {
          this.epics = res;
        }

        console.log(this.epics);
      });

    if (this.testScriptId) {
      this.testScriptService
        .getTestScriptById(this.testScriptId)
        .subscribe(testScript => {
          this.testScript = testScript;
          this.cdr.detectChanges();
          if (this.testScript && this.testScript.testScriptId) {
            if (this.mode === "copy") {
              this.testScript.testScriptId = "";
              this.testScript.name = "Copy of " + this.testScript.name;
            }

            this.resetTestScriptForm();
            this.testScriptForm.patchValue(this.testScript);
            this.tags = this.testScript.tags;

            let columnNames = [];
            if (this.testScript.testSteps.length !== 0) {
              this.testScript.testSteps.forEach((testStep, index) => {
                this.addTestStep(index, testStep);
                columnNames = columnNames.concat(
                  this.getColumnsfromParams(testStep.params)
                );
              });
            }

            const dataColumns = _.map(this.testScript.data, "columnName");
            if (dataColumns.length > 0) {
              columnNames = dataColumns;
            }
            columnNames.forEach(columnName => {
              this.addColumn(columnName);
            });

            const drs = _.zip(..._.map(this.testScript.data, "testData"));
            this.rowData = _.map(drs, dr => {
              let obj: any = _.zipObject(columnNames, dr);
              obj.id_ahq_2021 = Guid.create().toString();
              obj.edit_ahq_2021 = false;
              return obj;
            });
          }
        });
    }
  }

  getColumnsfromParams(params: Params) {
    let columns = [];
    if (params.cookie.type === ValueType.Column) {
      columns.push(params.cookie.value);
    }
    if (params.expected.type === ValueType.Column) {
      columns.push(params.expected.value);
    }
    if (params.number.type === ValueType.Column) {
      columns.push(params.number.value);
    }
    if (params.password?.type === ValueType.Column) {
      columns.push(params.password.value);
    }
    if (params.text.type === ValueType.Column) {
      columns.push(params.text.value);
    }
    if (params.variable.type === ValueType.Column) {
      columns.push(params.variable.value);
    }
    return columns;
  }
  public displayFn(storyMapView: StoryMapView): string {
    return storyMapView?.name || "";
  }

  getSelectedStory(storyMapView: StoryMapView) {
    this.testScriptForm.patchValue({ storyId: storyMapView.storyId });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.testScript && this.testScript.testScriptId) {
      this.resetTestScriptForm();
      this.testScriptForm.patchValue(this.testScript);
      this.tags = this.testScript.tags;

      this.testScript.testSteps.forEach((testStep, index) => {
        this.addTestStep(index, testStep);
      });

      const columnNames = _.map(this.testScript.data, "columnName");
      columnNames.forEach(columnName => {
        this.addColumn(columnName);
      });

      const drs = _.zip(..._.map(this.testScript.data, "testData"));
      this.rowData = _.map(drs, dr => {
        return _.zipObject(columnNames, dr);
      });
    }
  }

  addTag(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if (value.trim() !== "") {
      const tempTags = this.testScriptForm.controls["tags"].value;
      tempTags.push(value.trim());
      this.testScriptForm.controls["tags"].setValue(tempTags);
      if (this.testScriptForm.controls["tags"].valid) {
        this.testScriptForm.controls["tags"].markAsDirty();
        input.value = "";
      } else {
        const index = this.tags.findIndex(value1 => value1 === value.trim());
        if (index !== -1) {
          this.tags.splice(index, 1);
        }
      }
    } else {
      this.testScriptForm.controls["tags"].updateValueAndValidity();
    }
  }

  onRemoveTag(tag: string) {
    const controller = this.testScriptForm.controls["tags"];
    const index = this.tags.indexOf(tag, 0);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
    controller.updateValueAndValidity();
    controller.markAsDirty();
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

    this.columnsToDisplay = _.reject(this.columnsToDisplay, function(
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

  onlyOneOccurance(columnName: string) {
    const ts = this.testScriptForm.value as TestScript;
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

  onAddRow() {
    let nRow = { ...this.newRow };
    nRow.id_ahq_2021 = Guid.create().toString();
    this.rowData = [...this.rowData, nRow];
    this.editRow(
      _.find(this.rowData, rd => rd.id_ahq_2021 === nRow.id_ahq_2021)
    );
  }

  deleteSelectedRow() {
    if (this.isAllSelected()) {
      this.rowData = [];
      this.selection.clear();
    } else {
      this.rowData = _.reject(this.rowData, rd => {
        const index = this.selection.selected.findIndex(
          selRow => selRow.id_ahq_2021 === rd.id_ahq_2021
        );
        if (index > -1) {
          this.selection.deselect(this.selection.selected[index]);
        }
        return index > -1;
      });
    }
  }

  deleteRow(row: any) {
    this.rowData = _.reject(this.rowData, rd => {
      if (rd.id_ahq_2021 === row.id_ahq_2021) {
        const index = this.selection.selected.findIndex(
          selRow => selRow.id_ahq_2021 === rd.id_ahq_2021
        );
        if (index > -1) {
          this.selection.deselect(this.selection.selected[index]);
        }
        return true;
      }
      return false;
    });
  }

  editRow(row: any) {
    console.log(row);
    row.edit_ahq_2021 = true;
    this.editRows.push({ ...row });
  }

  updateEdit(row: any) {
    row.edit_ahq_2021 = false;
    this.editRows = _.reject(this.editRows, editRow => {
      return editRow.id_ahq_2021 === row.id_ahq_2021;
    });
  }

  cancelEdit(row: any) {
    let editRow = _.find(
      this.editRows,
      editRow => editRow.id_ahq_2021 === row.id_ahq_2021
    );
    if (editRow) {
      row = editRow;
    }
    row.edit_ahq_2021 = false;

    this.rowData = this.rowData.map(rowData => {
      if (rowData.id_ahq_2021 === row.id_ahq_2021) {
        rowData = row;
      }
      return rowData;
    });

    this.editRows = _.reject(this.editRows, editRow => {
      return editRow.id_ahq_2021 === row.id_ahq_2021;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rowData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.rowData);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  getColumnData() {
    const datas = [];
    const rowData = [...this.rowData];
    const dataColumns = this.getDataColumns();
    if (dataColumns.length > 0 || rowData.length > 0) {
      _.each(dataColumns, function(col) {
        datas.push({ columnName: col, testData: _.map(rowData, col) });
      });
    }
    console.log(datas);
    return datas;
  }

  public onTestScriptSaveClick(isExecute = false) {
    if (this.isValid()) {
      this.testScript = { ...this.testScript, ...this.testScriptForm.value };
      this.testScript.data = this.getColumnData();
      if (this.testScript.testScriptId) {
        this.testScriptService
          .updateTestScript(this.testScript)
          .subscribe(res => {
            this.notificationService.showNotification(
              "Test Script updated successfully",
              "",
              "top",
              "center"
            );
            this.filterService.filter();
            if (isExecute) {
              this.testScriptHandler.openTestScriptExecution(
                this.testScript.testScriptId
              );
            }
          });
      } else {
        // this.testScript.storyId = this.storyId;
        this.testScriptService.addTestScript(this.testScript).subscribe(res => {
          this.resetTestScriptForm();
          this.notificationService.showNotification(
            "Test Script created successfully",
            "",
            "top",
            "center"
          );
          this.filterService.filter();
          if (isExecute) {
            this.testScriptHandler.openTestScriptExecution(res["id"]);
          }
        });
      }
    }
  }

  onTestScriptCancelClick() {
    this.resetTestScriptForm();
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
        this.testScriptForm.controls["testSteps"]
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
    const testSteps = this.testScriptForm.get("testSteps") as FormArray;
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
    const testSteps = this.testScriptForm.get("testSteps") as FormArray;
    testSteps.removeAt(index);
    // const fileValuePair = testSteps.at(index).get("params").get("file").value as FileValuePair;

    // if (fileValuePair.fileId) {
    //   this.testScriptService.fileRemove(fileValuePair.fileId).subscribe(res => {
    //     testSteps.removeAt(index);
    //   });
    // } else {
    //   testSteps.removeAt(index);
    // }
  }

  isValid() {
    return this.testScriptForm.valid;
  }

  public get isStatusAHQRecommended() {
    return (
      this.testScriptForm.get("status")?.value === "To Be Repaired (AHQ Rec)"
    );
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

  resetTestScriptForm() {
    this.testScriptForm.reset();
    this.tags = [];
    this.testScriptForm.setControl("testSteps", this.fb.array([]));
    this.rowData = [];
    this.removeAllColumns();
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

  onImportFileChange(evt) {
    let data;
    const target: DataTransfer = <DataTransfer>evt.target;
    let isValidFile = !!target.files[0].name.match(/(.xls|.xlsx|.csv)/);

    if (isValidFile) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = e => {
        //this.keys = Object.keys(data[0]);
        this.rowData = data;
      };
    }
    this.inputImportFile.nativeElement.value = "";
  }
}
