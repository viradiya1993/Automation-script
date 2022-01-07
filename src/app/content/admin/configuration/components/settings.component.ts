import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  currentMenu: string = "globalParameters";

  constructor() {}

  onMenuSelect(name) {
    console.log("Setting Name: ", name);
    this.currentMenu = name;
  }
}
