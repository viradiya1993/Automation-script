import { Injectable } from "@angular/core";

declare const $: any;

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor() {}

  showNotification(
    title: string,
    message: string,
    from: string,
    align: string
  ) {
    $.notify(
      {
        icon: "notifications",
        title: title,
        message: message,
      },
      {
        type: "primary",
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },

        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="material-icons">close</i></button>' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          "</div>",
      }
    );
  }
}
