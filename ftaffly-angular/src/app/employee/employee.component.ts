import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance/attendance.component';
import { WorkReportComponent } from './work-report/work-report.component';
import { RequestLeaveComponent } from './request-leave/request-leave.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true, // Mark as standalone component
  imports: [CommonModule, AttendanceComponent, WorkReportComponent, RequestLeaveComponent], // Include AttendanceComponent
})
export class EmployeeComponent implements OnInit {
  currentSection: string = 'attendance'; // Default section
  isProfileMenuOpen: boolean = false; // Track dropdown menu state
  employeeId: string = '';
  email: string = '';

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    // Redirect non-employees away from the employee page
    if (!this.authService.isAuthenticated() || this.authService.getUserRole() !== 'EMPLOYEE') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Get the logged-in employee's email and ID
    this.email = this.authService.getUserEmail(); // Assuming you store the email in AuthService
    this.employeeService.getIdByEmail(this.email).subscribe({
      next: (id) => {
        this.employeeId = id;
      },
      error: (err) => {
        console.error('Failed to fetch employee ID:', err);
      },
    });
  }

  // Show the selected section
  showSection(section: string) {
    this.currentSection = section;
    this.authService.resetInactivityTimer();
  }

  // Toggle the profile dropdown menu
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.authService.resetInactivityTimer();
  }

  logout() {
    this.isProfileMenuOpen = false; // Close the dropdown menu
    this.authService.logout(); // Call the logout method from AuthService
    this.router.navigate(['/login']); // Redirect to the login page
  }
}