import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  login(email: string, password: string): boolean {
    if (email === 'temp' && password === 'temp') {
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }
}
