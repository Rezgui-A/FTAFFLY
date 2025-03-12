import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private email: string  = ""; // Add email property
  private isLoggedIn = false;
  private userRole: string | null = null;
  private inactivityTimer: any;
  private readonly inactivityDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  constructor(private router: Router) {
    const savedAuthState = localStorage.getItem('authState');
    if (savedAuthState) {
      const { isLoggedIn, userRole, email, lastActivity } = JSON.parse(savedAuthState);
      this.isLoggedIn = isLoggedIn;
      this.userRole = userRole;
      this.email = email; // Restore email from local storage
      this.startInactivityTimer(lastActivity);
    }
  }

  login(role: string, email: string) {
    this.isLoggedIn = true;
    this.userRole = role;
    this.email = email; // Set the email on login
    const lastActivity = Date.now();
    localStorage.setItem('authState', JSON.stringify({ isLoggedIn: true, userRole: role, email, lastActivity }));
    this.startInactivityTimer(lastActivity);
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
    this.email = ""; // Clear email on logout
    localStorage.removeItem('authState');
    this.clearInactivityTimer();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUserRole(): string | null {
    return this.userRole;
  }

  getUserEmail(): string {
    return this.email; // Method to get the email
  }

  private startInactivityTimer(lastActivity: number) {
    const elapsedTime = Date.now() - lastActivity;
    const remainingTime = this.inactivityDuration - elapsedTime;

    if (remainingTime > 0) {
      this.inactivityTimer = setTimeout(() => {
        this.logout();
      }, remainingTime);
    } else {
      this.logout();
    }
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  resetInactivityTimer() {
    this.clearInactivityTimer();
    const lastActivity = Date.now();
    localStorage.setItem('authState', JSON.stringify({ isLoggedIn: this.isLoggedIn, userRole: this.userRole, email: this.email, lastActivity }));
    this.startInactivityTimer(lastActivity);
  }
}