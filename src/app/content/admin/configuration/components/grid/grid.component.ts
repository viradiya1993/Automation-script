import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild,} from "@angular/core";
import { GridFormComponent } from "../grid-form/grid-form.component";
import { MatDialog } from "@angular/material/dialog";
import { Grid } from "@app/shared/models";
import { GridService } from "@app/core/services";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  dialogClosedEvent = new EventEmitter();
  constructor(public dialog: MatDialog, private gridService: GridService) {}

  openAddGridDialog() {
    const dialogRef = this.dialog.open(GridFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.dialogClosedEvent.emit();
    });
  }

  ngOnInit() {
  }

}
