import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "@core/services/";
import { OrganizationModal } from "@app/shared/models";

declare interface DataTable {
  headerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: "app-client-detail",
  templateUrl: "./client-details.component.html",
})
export class ClientDetailComponent implements OnInit, OnDestroy {
  public dataTable: DataTable;
  clientSummary = [];
  linear: true;
  companyInfo: OrganizationModal = new OrganizationModal();
  sub: any = null;

  constructor(
    private globalService: GlobalService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.globalService.changeGoal("Client Detail");
    this.sub = this.route.paramMap.subscribe((params) => {
      this.companyInfo.id = params.get("id");
      const companyDetail = JSON.parse(localStorage.getItem("companyDetail"));
      this.companyInfo.orgName = companyDetail.orgName;
    });
  }

  ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}
