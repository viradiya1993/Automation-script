import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-parmas',
  templateUrl: './custom-parmas.component.html',
  styleUrls: ['./custom-parmas.component.scss']
})
export class CustomParmasComponent implements OnInit {
  userScriptForm: FormGroup;
  constructor( private fb: FormBuilder, public dialogRef: MatDialogRef<CustomParmasComponent>, public dialog: MatDialog) { 
    this.userScriptForm = this.fb.group({
      parmsName: ['', Validators.required],
      paramsType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSaveParams() {}

  AddCustomeParams() {
    const dialogRef = this.dialog.open(CustomParmasComponent, {
      width: '1000px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onCancelClick() {
    this.dialog.closeAll();
  }
}
