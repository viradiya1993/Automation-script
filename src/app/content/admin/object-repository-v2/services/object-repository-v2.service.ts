import { Injectable, EventEmitter } from "@angular/core";
import { Website, Page } from "@app/shared/models";

@Injectable({
  providedIn: "root",
})
export class ObjectRepositoryV2Service {
  addPageEvent = new EventEmitter<string>();
  pageSelectedEvent = new EventEmitter<{ websiteId: string; pageId: string }>();
  pageCreatedEvent = new EventEmitter<Page>();
  pageUpdatedEvent = new EventEmitter<Page>();
  pageRemovedEvent = new EventEmitter<Page>();
  pageClosedEvent = new EventEmitter();

  addWebsiteEvent = new EventEmitter<string>();
  websiteSelectedEvent = new EventEmitter<Website>();
  websiteCreatedEvent = new EventEmitter<Website>();
  websiteUpdatedEvent = new EventEmitter<Website>();
  websiteRemovedEvent = new EventEmitter<Website>();
  websiteClosedEvent = new EventEmitter();

  constructor() {}
}
