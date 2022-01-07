import { Component, ViewChild, OnInit } from "@angular/core";
import { EpicService } from "@app/core/services";
import { Epic } from "@app/shared/models";
import { DialogService } from "../../services/dialog.service";
import { FilterService } from "../../services/filter.service";
import * as _ from "lodash";

declare const $: any;

@Component({
  selector: "app-epic-list",
  templateUrl: "./epic-list.component.html",
  styleUrls: ["./epic-list.component.scss"],
})
export class EpicListComponent implements OnInit {
  epics: Epic[] = [];
  epicToRemove: Epic;
  panelOpenState = false;

  constructor(
    private epicService: EpicService,
    private dialogService: DialogService,
    private filterService: FilterService
  ) {
    this.epicService.getEpics().subscribe((res) => {
      this.epics = res.data;
      this.showAllEpics();
    });
  }

  ngOnInit() {
    $("#removeEpicConfirmation").on("hide.bs.modal", function () {
      this.epicToRemove = undefined;
    });
  }

  selectedEpic(epic: Epic) {
    console.log(epic);
    this.filterService.appliedFilter.epic = {
      epicId: epic.epicId,
      name: epic.name,
    };
    this.filterService.appliedFilter.size = 10;
    this.filterService.appliedFilter.offset = 0;
    this.filterService.filter();
  }

  showAllEpics() {
    this.filterService.appliedFilter.epic = undefined;
    this.filterService.appliedFilter.size = 10;
    this.filterService.appliedFilter.offset = 0;
    this.filterService.filter();
  }

  openEpicDialog() {
    this.dialogService.openEpicDialog();
  }

  onEpicSaveChange() {
    this.epicService.getEpics().subscribe((res) => {
      this.epics = res.data;
    });
  }

  setEpicToRemove(epic: Epic) {
    this.epicToRemove = epic;
  }

  removeEpic(epic: Epic) {
    this.epicService.removeEpicById(epic.epicId).subscribe(() => {
      this.epics = _.reject(this.epics, ["epicId", epic.epicId]);

      if (
        this.filterService.appliedFilter.epic &&
        this.filterService.appliedFilter.epic.epicId === epic.epicId
      ) {
        this.filterService.appliedFilter.epic = undefined;
      }
      this.filterService.appliedFilter.size = 10;
      this.filterService.appliedFilter.offset = 0;
      this.filterService.filter();
    });
  }
}
