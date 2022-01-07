import { List } from "@app/shared/models";
import { Component, ViewChild, OnInit } from "@angular/core";
import { MessageService } from "@shared/components";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { GlobalService, OrganizationService } from "@core/services/";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ClientDialogComponent } from "./client-dialog/client-dialog.component";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = [
    "orgName",
    "userName",
    "email",
    "phone",
    "status",
    "actions",
  ];

  pageLength: number = 0;
  pageSize: number = 10;
  currentIndex: number = 0;

  dataSource = new MatTableDataSource();
  organizations: List[] = [];
  objects = [];

  pageSizeOptions: number[] = [10, 30, 50, 100];

  pageEvent: PageEvent;

  checked: boolean = false;
  @ViewChild('filterFormMatTrigger') filterFormMatTrigger: MatMenuTrigger;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private globalService: GlobalService,
    public messageService: MessageService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    localStorage.removeItem("clientId");
    this.globalService.changeGoal("Client");
    this.getClient();
  }

  loadClientsPage(pageEvent: any) {
    this.getClient(pageEvent.pageIndex);
  }

  editClient(data) {
    data["title"] = "Edit Organization Information";
    this.globalService.changeGoal(data);
    const dialogRef = this.dialog.open(ClientDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.globalService.changeGoal("Client");
      this.getClient();
    });
  }

  getClient(offset = 0) {
    this.currentIndex = offset;
    this.organizationService
      .getClients(offset, this.pageSize)
      .subscribe((client: any) => {
        let data: any[] = [];
        if (client.content) {
          client.content.forEach((org: any) => {
            let obj: any = {
              orgName: org.organization.orgName,
              subDomain: org.organization.subDomain,
              userName: org.adminUser
                ? org.adminUser.firstname + " " + org.adminUser.lastname
                : "No Admins found for this organization",
              email: org.adminUser ? org.adminUser.email : null,
              phone: org.adminUser ? org.adminUser.phone : null,
              id: org.organization.id,
              userId: org.adminUser ? org.adminUser.userId : null,
              active: org.organization.active,
            };
            data.push(obj);
          });
        }

        this.objects = data;
        this.dataSource.data = data;
        this.pageSize = client.pageable;
        this.pageLength = client.totalElements;
      });
  }

  getColSpan(ele: any) {
    return ele === "No Admins found for this organization" ? 3 : null;
  }

  getTextSpan(ele: any) {
    return ele === "No Admins found for this organization" ? "none" : null;
  }

  openDialog() {
    const obj = {
      flag: "Client",
      title: "Add Organization Information",
    };
    this.globalService.changeGoal(obj);
    const dialogRef = this.dialog.open(ClientDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.globalService.changeGoal("Client");
    });
  }

  updateStatus(status: any, org: any) {
    if (org) {
      if (status.checked == true) {
        this.organizationService.enableOrganization(org).subscribe((res) => {
          this.messageService.showMessage({
            type: "success",
            title: "",
            body: "Organization status enable.",
          });
        });
      } else {
        this.organizationService.disableOrganization(org).subscribe((res) => {
          this.messageService.showMessage({
            type: "success",
            title: "",
            body: "Organization status disable.",
          });
        });
      }

      let organization = this.objects.findIndex((data) => data.id === org);
      this.objects[organization]["active"] = status.checked;

      this.dataSource.data = this.objects;
    }
  }

  companyDetail(companyDetail: any) {
    let obj = {
      orgName: companyDetail.orgName,
    };
    localStorage.setItem("companyDetail", JSON.stringify(obj));
    localStorage.setItem("clientId", companyDetail.id);
    this.router.navigate(["/clients/" + companyDetail.id + "/detail"]);
  }

  applyFilter() {
    this.filterFormMatTrigger.closeMenu();
  }

  onFilterCancelClick() {
    this.filterFormMatTrigger.closeMenu();
  }
}
