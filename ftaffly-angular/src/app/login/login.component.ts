import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    // Redirect logged-in users away from the login page
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      if (role === 'MANAGER') {
        this.router.navigate(['/manager']);
      } else if (role === 'EMPLOYEE') {
        this.router.navigate(['/employee']);
      }
    }
  }

  onSubmit() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post<{ role: string }>('http://localhost:8080/api/employees/signin', credentials)
      .subscribe({
        next: (response) => {
          if (response.role) {
            this.authService.login(response.role, this.email); // Pass email to login method
            if (response.role === 'MANAGER') {
              this.router.navigate(['/manager']);
            } else if (response.role === 'EMPLOYEE') {
              this.router.navigate(['/employee']);
            }
          } else {
            this.errorMessage = 'Invalid email or password. Please try again.';
            console.error('Login error: Invalid credentials');
          }
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage = 'Invalid email or password. Please try again.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
          console.error('Login error:', err);
        },
      });
  }

}