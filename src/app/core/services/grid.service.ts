import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Grid } from '@app/shared/models';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Grid_API } from '@core/helpers';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  grids: Grid[] = [];

  grid_api = Grid_API + 'grids';

  constructor(private http: HttpClient) {
  }

  getGrids(sortColumn = 'name', sortOrder = 'asc', pageNumber = 0, pageSize = 10) {
    return this.http.get(`${this.grid_api}?offset=${pageNumber}&orderBy=${sortOrder}&size=${pageSize}&sortBy=${sortColumn}`)
      .pipe(
        map(res => {
          return {
            totalCount: res['totalElements'],
            data: res["content"] as Grid[]
          };
        })
      );
  }

  addGrid(grid: Grid) {
    grid.organizationId = localStorage.getItem('organizationId');
    grid.projectId = localStorage.getItem('projectId');
    grid.createdBy = JSON.parse(localStorage.getItem('user'));
    return this.http.post(this.grid_api, grid).pipe();
  }

  updateGrid(grid: Grid) {
    grid.updatedBy = JSON.parse(localStorage.getItem('user'));
    return this.http.put(`${this.grid_api}/${grid.gridId}`, grid).pipe();
  }

  removeGrid(gridId: string) {
    return this.http.delete(`${this.grid_api}/${gridId}`).pipe();
  }
}
