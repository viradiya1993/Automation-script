import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { VideoDialogComponent } from "@app/content/admin/landing-page/video-dialog.component";

@Component({
  selector: "app-unauthorized",
  templateUrl: "./unauthorized.component.html",
  styleUrls: ["./unauthorized.component.scss"],
})
export class UnAuthorizedComponent implements OnInit {
  toggleFrame3 = true;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openVideoDialog(url: any) {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: "90%",
      height: "90%",
      data: { link: url },
    });
  }
}
