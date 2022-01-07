import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-locator',
  templateUrl: './locator.component.html',
  styleUrls: ['./locator.component.scss']
})
export class LocatorComponent implements OnInit {

  locForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.locForm = this.formBuilder.group({
      locatorName: ['', Validators.required],
      locatorType: ['', Validators.required],
      locatorValue: ['', Validators.required],
    });

    const headers = new Headers({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaHFfdXNlciIsImF1dGhvcml0aWVzIjpbIlN1YnNjcmliZXIiXSwiaWF0IjoxNTUyNzIzOTAyLCJleHAiOjE1NTI4MTAzMDJ9.aFyCPZ21DWgjBoh7oogCYeJI77ye0wSyB50TdwzxdXw'
    });

    // this.route.params.subscribe(
    //   params => {
    //     this.http.get('http://api.automationhq.ai/locator-services/rest/api/locators/' + params['id'], { headers: headers }).subscribe(
    //       res => {
    //         const loc = res.json();
    //         this.locForm.setValue({
    //           locatorName: loc.locatorName,
    //           locatorType: loc.locateBy,
    //           locatorValue: loc.locatorValue
    //         });
    //       }
    //     )
    //   }
    // );
  }

}
