import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '@app/shared/models';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Environment_API } from '@core/helpers';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  environments: Environment[] = [];

  environment_api = Environment_API + 'environments';

  constructor(private http: HttpClient) {
  }

  getEnvironments(sortColumn = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get(`${this.environment_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`)
      .pipe(
        map(res => {
          return {
            totalCount: res['totalElements'],
            data: res["content"] as Environment[]
          };
        })
      );
  }

  addEnvironment(environment: Environment) {
    environment.organizationId = localStorage.getItem('organizationId');
    environment.projectId = localStorage.getItem('projectId');
    environment.createdBy = JSON.parse(localStorage.getItem('user'));
    return this.http.post(this.environment_api, environment).pipe();
  }

  updateEnvironment(environment: Environment) {
    environment.updatedBy = JSON.parse(localStorage.getItem('user'));
    return this.http.put(`${this.environment_api}/${environment.environmentId}`, environment).pipe();
  }

  removeEnvironment(environmentId: string) {
    return this.http.delete(`${this.environment_api}/${environmentId}`).pipe();
  }
}
