import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '@app/shared/models';
import { Configuration_API } from '@core/helpers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  configuration_api = Configuration_API + 'configuration';

  constructor(private http: HttpClient) {
  }

  saveConfiguration(configuration: Configuration) {
    configuration.organizationId = localStorage.getItem('organizationId');
    configuration.projectId = localStorage.getItem('projectId');
    configuration.configurationId = localStorage.getItem('projectId') + "_1";
    localStorage.setItem("configuration", JSON.stringify(configuration));
    return Observable.of(configuration.configurationId);
  }

  getConfiguration() {
    let configuration = JSON.parse(localStorage.getItem("configuration"));
    return Observable.of(configuration);
  }
}
