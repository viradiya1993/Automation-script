import { Injectable } from "@angular/core";
import { Project, UserInfoModel } from "@app/shared/models";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjectUserService {
  // Project Selected
  private projectSelectedSubject: Subject<{ project: Project }>;
  public projectSelectedObs: Observable<{ project: Project }>;

  // Project Created
  private projectCreatedSubject: Subject<{ project: Project }>;
  public projectCreatedObs: Observable<{ project: Project }>;

  // Project Updated
  private projectUpdatedSubject: Subject<{ project: Project }>;
  public projectUpdatedObs: Observable<{ project: Project }>;

  // Project Deleted
  private projectDeletedSubject: Subject<{ project: Project }>;
  public projectDeletedObs: Observable<{ project: Project }>;

  // User Created
  private userCreatedSubject: Subject<{ user: UserInfoModel }>;
  public userCreatedObs: Observable<{ user: UserInfoModel }>;

  // User Updated
  private userUpdatedSubject: Subject<{ user: UserInfoModel }>;
  public userUpdatedObs: Observable<{ user: UserInfoModel }>;

  // User Deleted
  private userDeletedSubject: Subject<{ user: UserInfoModel }>;
  public userDeletedObs: Observable<{ user: UserInfoModel }>;

  // User Assign
  private userAssignSubject: Subject<{
    projectId: string;
    user: UserInfoModel[];
  }>;
  public userAssignObs: Observable<{
    projectId: string;
    user: UserInfoModel[];
  }>;

  constructor() {
    // Project Selected
    this.projectSelectedSubject = new Subject<{ project: Project }>();
    this.projectSelectedObs = this.projectSelectedSubject.asObservable();

    // Project Created
    this.projectCreatedSubject = new Subject<{ project: Project }>();
    this.projectCreatedObs = this.projectCreatedSubject.asObservable();

    // Project Updated
    this.projectUpdatedSubject = new Subject<{ project: Project }>();
    this.projectUpdatedObs = this.projectUpdatedSubject.asObservable();

    // Project Deleted
    this.projectDeletedSubject = new Subject<{ project: Project }>();
    this.projectDeletedObs = this.projectDeletedSubject.asObservable();

    // User Created
    this.userCreatedSubject = new Subject<{ user: UserInfoModel }>();
    this.userCreatedObs = this.userCreatedSubject.asObservable();

    // User Updated
    this.userUpdatedSubject = new Subject<{ user: UserInfoModel }>();
    this.userUpdatedObs = this.userUpdatedSubject.asObservable();

    // User Deleted
    this.userDeletedSubject = new Subject<{ user: UserInfoModel }>();
    this.userDeletedObs = this.userDeletedSubject.asObservable();

    // User Assigned
    this.userAssignSubject = new Subject<{
      projectId: string;
      user: UserInfoModel[];
    }>();
    this.userAssignObs = this.userAssignSubject.asObservable();
  }

  public projectSelected(project: Project) {
    this.projectSelectedSubject.next({ project });
  }

  public projectCreated(project: Project) {
    this.projectCreatedSubject.next({ project });
  }

  public projectUpdated(project: Project) {
    this.projectUpdatedSubject.next({ project });
  }

  public projectDeleted(project: Project) {
    this.projectDeletedSubject.next({ project });
  }

  public userCreated(user: UserInfoModel) {
    this.userCreatedSubject.next({ user });
  }

  public userUpdated(user: UserInfoModel) {
    this.userUpdatedSubject.next({ user });
  }

  public userDeleted(user: UserInfoModel) {
    this.userDeletedSubject.next({ user });
  }

  public userRoleAssign(projectId: string, user: UserInfoModel[]) {
    this.userAssignSubject.next({ projectId, user });
  }
}
