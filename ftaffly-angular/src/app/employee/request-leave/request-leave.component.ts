import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.css'],
  imports : [CommonModule,FormsModule]
})
export class RequestLeaveComponent implements OnInit {
  leaveRequest = {
    fromDate: '',
    toDate: '',
    leaveType: '',
    reason: '',
  };

  leaveRequests: any[] = []; // Array to store leave request history
  employeeId: string = ''; // Employee ID
  email: string = ''; // Employee email

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    // Get email from AuthService
    this.email = this.authService.getUserEmail();

    if (!this.email) {
      console.error('Email is missing.');
      return;
    }

    // Fetch employeeId using email
    this.fetchEmployeeId(this.email);
  }

  // Fetch employeeId using email
  fetchEmployeeId(email: string): void {
    this.employeeService.getIdByEmail(this.email).subscribe({
      next: (id) => {
        this.employeeId = id;
        this.fetchLeaveRequests(this.employeeId); // Fetch leave requests after getting employeeId
      },
      error: (err) => {
        console.error('Failed to fetch employee ID:', err);
      },
    });
  }

  // Fetch leave requests by employeeId
  fetchLeaveRequests(employeeId: string): void {
    this.http.get<any[]>(`http://localhost:8080/api/leave-requests/employee/${employeeId}`).subscribe({
      next: (response) => {
        this.leaveRequests = response; // Update the leaveRequests array
      },
      error: (err) => {
        console.error('Failed to fetch leave requests:', err);
      },
    });
  }

  // Submit a leave request
  onSubmit(): void {
    const leaveRequest = {
      ...this.leaveRequest,
      employeeId: this.employeeId,
    };

    this.http.post('http://localhost:8080/api/leave-requests', leaveRequest).subscribe({
      next: (response) => {
        console.log('Leave request submitted:', response);
        this.fetchLeaveRequests(this.employeeId); // Refresh the leave request history
        this.leaveRequest = { fromDate: '', toDate: '', leaveType: '', reason: '' }; // Reset the form
        alert('Leave request submitted successfully!');
      },
      error: (err) => {
        console.error('Failed to submit leave request:', err);
        alert('Failed to submit leave request. Please try again.');
      },
    });
  }
}