import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalParameters, NameValuePair } from '@app/shared/models';
import { Global_Parameters_API } from '@core/helpers';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalParametersService {

  globalParameters_api = Global_Parameters_API + 'globalParameters';

  constructor(private http: HttpClient) {
  }

  addGlobalParameters(globalParameters: GlobalParameters) {
    globalParameters.organizationId = localStorage.getItem('organizationId');
    globalParameters.projectId = localStorage.getItem('projectId');

    globalParameters.createdBy = JSON.parse(localStorage.getItem('user'));
    return this.http.post(this.globalParameters_api, globalParameters).pipe();
  }

  updateGlobalParameters(globalParameters: GlobalParameters) {
    globalParameters.updatedBy = JSON.parse(localStorage.getItem('user'));
    return this.http.put(`${this.globalParameters_api}/${globalParameters.globalParameterId}`, globalParameters).pipe();
  }

  getGlobalParameters() {
    return this.http.get(`${this.globalParameters_api}`).pipe(
      map(res => {
        return res as GlobalParameters;
      })
    );
  }

  getGlobalParametersById(globalParameterId: string) {
    return this.http.get(`${this.globalParameters_api}/${globalParameterId}`).pipe(
      map(res => {
        return res as GlobalParameters;
      })
    );
  }

  getGlobalParametersByName(globalParameterName: string) {
    return this.http.get(`${this.globalParameters_api}/search?name=${globalParameterName}`).pipe(
      map(res => {
        return res as NameValuePair[];
      })
    );
  }
}
