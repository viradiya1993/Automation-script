import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import {
  Page,
  NameValuePair,
  ValueType,
  FileValuePair,
  Website
} from "@app/shared/models";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { of } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { PageService, TestScriptService, WebsiteService } from "@app/core/services";
import { MatDialog } from "@angular/material/dialog";
import { AddLocatorComponent, AddPagesComponent } from "@app/shared/components";
import { ObjectRepositoryV2Service } from "@app/content/admin/object-repository-v2/services/object-repository-v2.service";
import * as _ from "lodash";

@Component({
  selector: "app-test-step-form",
  templateUrl: "./test-step-form.component.html",
  styleUrls: ["./test-step-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestStepFormComponent implements OnInit {
  @Input() testStepFG: FormGroup;
  @Input() pages: Page[];
  @Input() columns: any[];
  @Input() globalParameters: NameValuePair[];
  @Output() addColumnEvent = new EventEmitter<string>();
  @Output() removeColumnEvent = new EventEmitter<string>();

  @ViewChild("number") numberInputRef: ElementRef;
  @ViewChild("text") textInputRef: ElementRef;
  @ViewChild("password") passwordInputRef: ElementRef;
  @ViewChild("variable") variableInputRef: ElementRef;
  @ViewChild("cookie") cookieInputRef: ElementRef;
  @ViewChild("expected") expectedInputRef: ElementRef;

  keywords: string[] = [];
  paramsFG: FormGroup;
  selectable = true;
  removable = true;
  addOnBlur = true;
  show: boolean = true;
  texts: string[] = [];
  numbers: string[] = [];
  variables: string[] = [];
  cookies: string[] = [];
  expecteds: string[] = [];
  passwords: string[] = [];

  filteredNameValuePairs: NameValuePair[] = [];

  fileValuePair: FileValuePair = {
    fileId: "",
    name: "",
    url: ""
  };

  selectedPage: Page;
  websites: Website[] = [];
  selectedWebsite: Website = null;
  constructor(private testScriptService: TestScriptService,
    public dialog: MatDialog,
    private websiteService: WebsiteService,
    private pageService: PageService,
    private objectRepositoryV2Service: ObjectRepositoryV2Service) {
    this.websiteService.getWebsites(0).subscribe((websites) => {
      this.websites = websites;
    });

    this.objectRepositoryV2Service.pageCreatedEvent.subscribe((page) => {
      this.websiteService.getWebsites(0).subscribe((websites) => {
        this.websites = websites;
      });
      this.pageService
        .getPagesByWebsiteId(this.selectedWebsite.websiteId)
        .subscribe((pages) => {
          this.pages = pages;
        });
    });

    this.objectRepositoryV2Service.pageUpdatedEvent.subscribe((page) => {
      this.pages = _.map(this.pages, (page_t) =>
        page_t.pageId === page.pageId ? page : page_t
      );
    });

    this.objectRepositoryV2Service.websiteCreatedEvent.subscribe((website) => {
      this.websites.push(website);
    });

    this.objectRepositoryV2Service.websiteUpdatedEvent.subscribe((website) => {
      this.websites = _.map(this.websites, (website_t) =>
        website_t.websiteId === website.websiteId ? website : website_t
      );
    });

    this.objectRepositoryV2Service.websiteSelectedEvent.subscribe((website) => {
      if (!website) {
        this.selectedWebsite = null;
        this.pages = [];
      }
    });
  }

  getConfigName(tag: string) {
    if (tag.startsWith("config.")) {
      return this.globalParameters.find(
        gp => gp.value === tag.replace("config.", "")
      ).name;
    } else {
      return tag;
    }
  }

  ngOnInit() {
    const templateTitle = this.testStepFG.controls["templateTitle"]
      .value as string;
    this.keywords = templateTitle.split(" ");
    this.paramsFG = this.testStepFG.controls["params"] as FormGroup;

    this.keywords.forEach(keyword => {
      if (keyword === "{{text}}") {
        this.params2ValueChanges("text");
      } else if (keyword === "{{number}}") {
        this.params2ValueChanges("number");
      } else if (keyword === "{{variable}}") {
        this.params2ValueChanges("variable");
      } else if (keyword === "{{cookie}}") {
        this.params2ValueChanges("cookie");
      } else if (keyword === "{{expected}}") {
        this.params2ValueChanges("expected");
      } else if (keyword === "{{ui-locator}}") {
        this.params1ValueChanges("uiLocator");
      } else if (keyword === "{{ui-table}}") {
        this.params1ValueChanges("uiTable");
      } else if (keyword === "{{password}}") {
        this.params2ValueChanges("password");
      } else if (keyword === "{{file}}") {
        this.fileValuePair = this.paramsFG.controls["file"].value;
      }
    });

    if (this.globalParameters && this.globalParameters.length) {
      if (this.texts.length) {
        this.texts = this.texts.map(text => this.getConfigName(text));
      }
      if (this.passwords.length) {
        this.passwords = this.passwords.map(password =>
          this.getConfigName(password)
        );
      }
      if (this.numbers.length) {
        this.numbers = this.numbers.map(number => this.getConfigName(number));
      }
      if (this.variables.length) {
        this.variables = this.variables.map(variable =>
          this.getConfigName(variable)
        );
      }
      if (this.cookies.length) {
        this.cookies = this.cookies.map(cookie => this.getConfigName(cookie));
      }
      if (this.expecteds.length) {
        this.expecteds = this.expecteds.map(expected =>
          this.getConfigName(expected)
        );
      }
    }
  }

  add(event: MatChipInputEvent, type: string) {
    const typeFG = this.paramsFG.controls[type];
    const input = event.input;
    const value = event.value.trim();

    if (
      this.allowOnlyOneTag(type) &&
      value &&
      value !== "data." &&
      value !== "config."
    ) {
      typeFG.setErrors(null);
      if (type === "text") {
        this.texts.push(value);
      } else if (type === "number") {
        this.numbers.push(value);
      } else if (type === "variable") {
        this.variables.push(value);
      } else if (type === "cookie") {
        this.cookies.push(value);
      } else if (type === "password") {
        this.passwords.push(value);
      } else if (type === "expected") {
        this.expecteds.push(value);
      }

      if (value && value.match(/data\.([A-Z*a-z*]+[0-9]*)+/)) {
        this.addColumnEvent.emit(value.replace("data.", ""));
        typeFG.get("type").setValue(ValueType.Column);
        typeFG.get("value").setValue(value.replace("data.", ""));
      } else if (value && value.match(/config\.([A-Z*a-z*]+[0-9]*)+/)) {
        typeFG.get("type").setValue(ValueType.Configuration);
        typeFG.get("value").setValue(value.replace("config.", ""));
      } else {
        typeFG.get("type").setValue(ValueType.Data);
        typeFG.get("value").setValue(value);
      }

      if (typeFG.valid) {
        typeFG.markAsDirty();
        input.value = "";
      }
    } else {
      input.value = "";
    }
    typeFG.updateValueAndValidity();
  }

  allowOnlyOneTag(type: string) {
    if (
      (type === "text" && this.texts.length === 0) ||
      (type === "password" && this.passwords.length === 0) ||
      (type === "number" && this.numbers.length === 0) ||
      (type === "variable" && this.variables.length === 0) ||
      (type === "cookie" && this.cookies.length === 0) ||
      (type === "expected" && this.expecteds.length === 0)
    ) {
      return true;
    }
    return false;
  }

  selected(event: MatAutocompleteSelectedEvent, type: string) {
    if (!this.allowOnlyOneTag(type)) {
      return;
    }

    const viewValue = event.option.viewValue.trim();
    if (type === "text") {
      this.texts.push(viewValue);
      this.textInputRef.nativeElement.value = "";
    } else if (type === "number") {
      this.numbers.push(viewValue);
      this.numberInputRef.nativeElement.value = "";
    } else if (type === "password") {
      this.passwords.push(viewValue);
      this.passwordInputRef.nativeElement.value = "";
    } else if (type === "variable") {
      this.variables.push(viewValue);
      this.variableInputRef.nativeElement.value = "";
    } else if (type === "cookie") {
      this.cookies.push(viewValue);
      this.cookieInputRef.nativeElement.value = "";
    } else if (type === "expected") {
      this.expecteds.push(viewValue);
      this.expectedInputRef.nativeElement.value = "";
    }

    if (viewValue.match(/data\.([A-Z*a-z*]+[0-9]*)+/)) {
      this.paramsFG.controls[type].get("type").setValue(ValueType.Column);
    } else if (viewValue.match(/config\.([A-Z*a-z*]+[0-9]*)+/)) {
      this.paramsFG.controls[type]
        .get("type")
        .setValue(ValueType.Configuration);
    }
  }

  remove(type: string, val: string): void {
    const controller = this.paramsFG.controls[type].get("value");
    let index = -1;
    if (type === "text") {
      index = this.texts.indexOf(val);
    } else if (type === "number") {
      index = this.numbers.indexOf(val);
    } else if (type === "password") {
      index = this.passwords.indexOf(val);
    } else if (type === "variable") {
      index = this.variables.indexOf(val);
    } else if (type === "cookie") {
      index = this.cookies.indexOf(val);
    } else if (type === "expected") {
      index = this.expecteds.indexOf(val);
    }

    if (index >= 0) {
      if (type === "text") {
        this.texts.splice(index, 1);
      } else if (type === "number") {
        this.numbers.splice(index, 1);
      } else if (type === "password") {
        this.passwords.splice(index, 1);
      } else if (type === "variable") {
        this.variables.splice(index, 1);
      } else if (type === "cookie") {
        this.cookies.splice(index, 1);
      } else if (type === "expected") {
        this.expecteds.splice(index, 1);
      }

      if (val.trim() && val.trim().match(/data\.([A-Z*a-z*]+[0-9]*)+/)) {
        this.removeColumnEvent.emit(val.trim().replace("data.", ""));
      }
      controller.setValue("");
      controller.enable();
      controller.updateValueAndValidity();
      controller.markAsDirty();
    }
  }

  params1ValueChanges(controlName: string) {
    this.paramsFG.controls[controlName]
      .get("locatorId")
      .setValidators(Validators.required);
    this.paramsFG.controls[controlName]
      .get("locatorId")
      .updateValueAndValidity();
    if (this.paramsFG.controls[controlName].get("deleted").value) {
      this.paramsFG.controls[controlName].patchValue({ locatorId: "" });
    }
  }

  setPageId(controlName: string, pageId: string) {
    if (controlName && pageId) {
      this.paramsFG.controls[controlName].get("pageId").setValue(pageId);
      this.paramsFG.controls[controlName].get("deleted").setValue(false);
    }
  }

  isDeleted(controlName: string): boolean {
    return this.paramsFG.controls[controlName].get("deleted").value;
  }

  params2ValueChanges(controlName: string) {
    let value = this.paramsFG.controls[controlName].get("value").value;
    if (value) {
      const type = this.paramsFG.controls[controlName].get("type").value;
      if (type === 1) {
        value = "data." + value;
      } else if (type === 2) {
        value = "config." + value;
      }

      if (controlName === "number") {
        this.numbers.push(value.trim());
      } else if (controlName === "text") {
        this.texts.push(value.trim());
      } else if (controlName === "password") {
        this.passwords.push(value.trim());
      } else if (controlName === "variable") {
        this.variables.push(value.trim());
      } else if (controlName === "cookie") {
        this.cookies.push(value.trim());
      } else if (controlName === "expected") {
        this.expecteds.push(value);
      }
    }
    this.paramsFG.controls[controlName]
      .get("value")
      .setValidators(Validators.required);
    this.paramsFG.controls[controlName].get("value").updateValueAndValidity();
    this.paramsFG.controls[controlName]
      .get("type")
      .setValidators(Validators.min(0));
    this.paramsFG.controls[controlName].get("type").updateValueAndValidity();

    this.paramsFG.controls[controlName]
      .get("value")
      .valueChanges.pipe(
        debounceTime(500),
        switchMap(searchTerm => {
          if (searchTerm && searchTerm.startsWith("config.")) {
            return of(this.getFilteredGlobalParameters(searchTerm));
          } else if (searchTerm && searchTerm.startsWith("data.")) {
            return of(this.getfilteredColumns(searchTerm));
          } else {
            return of(null);
          }
        })
      )
      .subscribe(nameValuePairs => {
        this.filteredNameValuePairs = nameValuePairs;
      });
  }

  getfilteredColumns(name) {
    return this.columns
      .map(
        column => ({ name: "data." + column, value: column } as NameValuePair)
      )
      .filter(column => column.name.startsWith(name));
  }

  getFilteredGlobalParameters(name) {
    return this.globalParameters.filter(globalParameter =>
      globalParameter.name.startsWith(name)
    );
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      console.log(imgFile.target.files[0].name);

      if (this.fileValuePair && this.fileValuePair.fileId) {
        this.testScriptService
          .fileUpdate(this.fileValuePair.fileId, imgFile.target.files[0])
          .subscribe(res => {
            console.log(res);
            this.paramsFG.controls["file"].setValue({
              fileId: res["fileId"],
              name: res["name"],
              url: res["url"]
            });
          });
      } else {
        this.testScriptService
          .fileUpload(imgFile.target.files[0])
          .subscribe(res => {
            console.log(res);
            this.paramsFG.controls["file"].setValue({
              fileId: res["fileId"],
              name: res["name"],
              url: res["url"]
            });
          });
      }
    }
  }

  addLocator(page: Page, thisEl) {
    this.show = false;
    const dialogRef = this.dialog.open(AddLocatorComponent, {
      disableClose: true,
      width: '400px',
      data: {
        website: this.selectedWebsite,
        websiteId: page.websiteId,
        pageId: page.pageId,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.show = true;
      if (result) {
        console.log(result, 'add loc after');
        console.log(result.result.id);
      }
    });
  }

  addPage(page: Page, thisEl) {
    this.show = false;
    const dialogRef = this.dialog.open(AddPagesComponent, {
      disableClose: true,
      width: '100%',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      panelClass: "application-page-dialog",
      data: {
        website: this.selectedWebsite,
        websiteId: page.websiteId,
        pageId: page.pageId,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.show = true;
      if (result) {

      }
    });
  }

  
}
