import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Browser } from '@app/shared/models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserService } from '@app/core/services';

@Component({
  selector: 'app-browser-form',
  templateUrl: './browser-form.component.html',
  styleUrls: ['./browser-form.component.scss']
})
export class BrowserFormComponent implements OnInit {

  browser: Browser;
  browserForm: FormGroup;
 
  constructor(private fb: FormBuilder, private browserService: BrowserService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.browserForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required]
    });

    if (data) {
      this.browser = data.browser;
      if (this.browser) {
        this.browserForm.patchValue(this.browser);
      }
    }
  }

  ngOnInit() { }

  onBrowserSaveClick() {
    console.log(this.browserForm.value);
    this.browser = { ...this.browser, ...this.browserForm.value };
    if (this.browser.browserId) {
      this.browserService.updateBrowser(this.browser).subscribe();
    } else {
      this.browserService.addBrowser(this.browser).subscribe();
    }
  }

  onBrowserCancelClick() {
    this.browserForm.reset();
  }

}
