import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Subscription } from "rxjs";
import { MessageService } from "./messageService.service";
import { ToasterService, ToasterConfig, Toast } from "angular2-toaster";

@Component({
  selector: "app-message",
  templateUrl: "messageService.component.html",
  styleUrls: ["messageService.component.scss"],
  providers: [ToasterService],
})
export class MessageServiceComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscription: Subscription = new Subscription();
  messageDetail: Toast;
  private toasterService: ToasterService;

  public config1: ToasterConfig = new ToasterConfig({
    animation: "fade",
    newestOnTop: true,
    positionClass: "toast-top-right",
    showCloseButton: true,
  });

  constructor(
    public messageService: MessageService,
    toasterService: ToasterService
  ) {
    this.toasterService = toasterService;
    this.subscription = this.messageService.loaderState.subscribe(
      (state: Toast) => {
        this.messageDetail = state;
        // this.messageDetail.showCloseButton = true;
        this.toasterService.pop(this.messageDetail);
      }
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
