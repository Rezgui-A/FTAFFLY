import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { EmployeesComponent } from "../employees/employees.component"; // Import FormsModule

@Component({
  selector: 'app-add-employee-form',
  templateUrl: './add-employee-form.component.html',
  styleUrls: ['./add-employee-form.component.css'],
  imports: [CommonModule, FormsModule], // Add imports for standalone components
})
export class AddEmployeeFormComponent {
  employee = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE', // Default role
    isActive: true, // Default active status
  };

  showSuccessMessage: boolean = false; // Flag for success message
  showErrorMessage: boolean = false; // Flag for error message
  errorMessage: string = ''; // Store the error message

  @Output() formSubmitted = new EventEmitter<void>(); // Emit event when form is submitted

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http
      .post('http://localhost:8080/api/employees', this.employee)
      .subscribe({
        next: (response) => {
          console.log('Employee added successfully:', response);
          this.showSuccessMessage = true; // Show success message
          this.showErrorMessage = false; // Hide error message
          this.formSubmitted.emit(); // Notify parent component
          this.resetForm(); // Reset the form
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          if (err.status === 409) {
            // Assuming 409 is the status code for "Email already exists"
            this.showErrorMessage = true; // Show error message
            this.errorMessage = 'Employee already has an account with this email.';
          } else {
            this.showErrorMessage = true; // Show generic error message
            this.errorMessage = 'An error occurred while adding the employee.';
          }
          this.showSuccessMessage = false; // Hide success message
        },
      });
  }

  resetForm() {
    this.employee = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'EMPLOYEE',
      isActive: true,
    };
  }
}