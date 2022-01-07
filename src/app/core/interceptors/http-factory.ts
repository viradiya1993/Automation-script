import { Router } from '@angular/router';
import { HttpXhrBackend } from '@angular/common/http';
import { HttpRequestInterceptor } from '@app/core/interceptors/http-request.interceptor';
import { LocalStorageService } from '@core/services';
import { MessageService } from '@shared/components';
import { NgxSpinnerService } from 'ngx-spinner';

export function httpFactory(xhrBackend: HttpXhrBackend,
  router: Router,
  localStorageService: LocalStorageService,
  messageService: MessageService,
  spinner: NgxSpinnerService
) {
  return new HttpRequestInterceptor(xhrBackend, router, localStorageService, messageService, spinner);
}
