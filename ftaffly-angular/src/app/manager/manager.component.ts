import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RequestLeaveComponent } from "./request-leave/request-leave.component";
import { WorkReportsComponent } from "./work-reports/work-reports.component";
import { EmployeesComponent } from "./employees/employees.component"; // Import AuthService
import { AddEmployeeFormComponent } from './add-employee-form/add-employee-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],
  imports: [CommonModule, DashboardComponent, RequestLeaveComponent, WorkReportsComponent, EmployeesComponent,AddEmployeeFormComponent],
})
export class ManagerComponent {
  currentSection: string = 'dashboard'; // Default section
  isProfileMenuOpen: boolean = false; // Track dropdown menu state
  showAddEmployee: boolean = false; // Track form visibility

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
  showAddEmployeeForm() {
    this.isProfileMenuOpen = false; // Close the dropdown menu
    this.showAddEmployee = true; // Show the form
    this.authService.resetInactivityTimer();

  }
    onEmployeeAdded() {
    this.showAddEmployee = false; // Hide the form after submission
    this.showSection('employees'); // Switch to the employees section
    this.authService.resetInactivityTimer();

  }
  constructor(private authService: AuthService, private router: Router) {
    // Redirect non-managers away from the manager page
    if (!this.authService.isAuthenticated() || this.authService.getUserRole() !== 'MANAGER') {
      this.router.navigate(['/login']);
    }
    
  }
}