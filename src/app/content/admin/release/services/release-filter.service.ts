import { Injectable } from "@angular/core";
import { ReleaseService } from "@app/core/services";
import { ReleaseRunView, ReleaseFilter } from "@app/shared/models";
import { Subject } from "rxjs";

@Injectable()
export class ReleaseFilterService {

    private filterSource = new Subject();
    private testRunFilterSource = new Subject<ReleaseRunView[]>();

    testRunFilterUpdated$ = this.testRunFilterSource.asObservable();
    filterUpdated$ = this.filterSource.asObservable();

    readonly defaultFilter: ReleaseFilter = {
        releaseId: "",
        offset: -1,
        size: -1,
        hasFailedTests: false,
        noPassedTests: false,
        hasSkippedTests: false
    };

    appliedFilter: any = {
        release: undefined,
        hasFailedTests: false,
        noPassedTests: false,
        hasSkippedTests: false
    }

    constructor(private releaseService: ReleaseService) { }

    filter() {
        return this.releaseService.getReleaseRunsByFilter(this.getFilterObj()).subscribe(res => {
            this.filterSource.next();
            this.testRunFilterSource.next(res['data']);
        });
    }

    getFilterObj() {
        let filter = this.defaultFilter;
        if (this.appliedFilter.release) {
            filter.releaseId = this.appliedFilter.release.releaseId;
        } else {
            filter.releaseId = "";
        }
        filter.hasFailedTests = this.appliedFilter.hasFailedTests;
        filter.hasSkippedTests = this.appliedFilter.hasSkippedTests;
        filter.noPassedTests = this.appliedFilter.noPassedTests;
        return filter;
    }
}