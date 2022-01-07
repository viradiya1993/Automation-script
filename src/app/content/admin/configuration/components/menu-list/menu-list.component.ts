import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-settings-menu",
  templateUrl: "./menu-list.component.html",
})
export class MenuListComponent {
  currentMenu: string = "globalParameters";

  @Output() menuSelect = new EventEmitter();

  constructor() {}

  onMenuSelect(menuName: string, event: any) {
    this.currentMenu = menuName;
    this.menuSelect.emit(menuName);
    console.log("menuName: ", menuName);
  }
}
