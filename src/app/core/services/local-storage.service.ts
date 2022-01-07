import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  getCurrentUser() {
    if (localStorage.getItem('Authorization')) {
      return localStorage.getItem('Authorization');
    } else {
      return null;
    }
  }

  getAccessToken(): string {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return currentUser;
    }
    return '';
  }

  setCurrentUser(userDetail) {
    localStorage.removeItem('Authorization');
    localStorage.setItem('Authorization', 'bearer ' + userDetail.AccessToken);
  }

  removeLogin() {
    let rememberMe = localStorage.getItem('rememberMe');
    localStorage.clear();
    if (rememberMe) {
      localStorage.setItem('rememberMe', rememberMe);
    }
  }
}
