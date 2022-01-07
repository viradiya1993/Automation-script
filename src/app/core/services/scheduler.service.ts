import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchedulerResourceType } from '@app/shared/enums';
import { Scheduler, SchedulerFilter } from '@app/shared/models';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Scheduler_API } from '../helpers';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  scheduler_api = Scheduler_API + 'schedulers';

  private schedulerFilterSource = new Subject<any>();
  schedulerFilterUpdated$ = this.schedulerFilterSource.asObservable();

  readonly defaultFilter: SchedulerFilter = {
    resourceId: null,
    resourceType: null,
    orderBy: "desc",
    sortBy: "createdDate",
    offset: -1,
    size: -1
  };

  appliedFilter: any = {
    resourceId: null,
    resourceType: null,
    offset: -1,
    size: -1
  }

  constructor(private http: HttpClient) { }

  getSchedulersByFilter(filter: SchedulerFilter) {
    return this.http.post(`${this.scheduler_api}/listByFilter`, filter).pipe(
      map(res => {
        return {
          data: res['content'] as Scheduler[],
          totalCount: res['totalElements']
        };
      })
    );
  }

  addScheduler(scheduler: Scheduler) {
    return this.http.post(this.scheduler_api, scheduler).pipe(
      catchError((err) => {
        return of({ schedulerId: err['text'] });
      })
    );;
  }

  updateScheduler(scheduler: Scheduler) {
    return this.http.put(`${this.scheduler_api}/${scheduler.schedulerId}`, scheduler).pipe();
  }

  removeScheduler(schedulerId: string) {
    return this.http.delete(`${this.scheduler_api}/${schedulerId}`).pipe();
  }

  filter() {
    return this.getSchedulersByFilter(this.getFilterObj()).subscribe((res: any) => {
      this.schedulerFilterSource.next(res);
    });
  }

  getFilterObj() {
    let filter = this.defaultFilter;
    filter.resourceId = this.appliedFilter.resourceId;
    filter.resourceType = this.appliedFilter.resourceType;
    filter.offset = this.appliedFilter.offset;
    filter.size = this.appliedFilter.size;
    return filter;
  }
}
