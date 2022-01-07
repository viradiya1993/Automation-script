import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app.routing";
import { SharedModule } from "@shared/shared.module";
import { CoreModule } from "@core/core.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ACCESS_TOKEN } from "./shared/configs";
import { MessageService, MessageServiceComponent } from "./shared/components";
import { ToasterModule } from "angular2-toaster";

import "jquery";

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN);
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    ScrollingModule,
    AppRoutingModule,
    ToasterModule.forRoot(),
  ],
  declarations: [AppComponent, MessageServiceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
