import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalEmployees: number = 0;
  activeEmployees: number = 0;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    // Fetch total employees
    this.http
        .get<{ totalEmployees: number }>('http://localhost:8080/api/employees/count')
        .subscribe({
            next: (data) => {
                this.totalEmployees = data.totalEmployees;
            },
            error: (err) => {
                this.errorMessage = 'Failed to fetch total employees. Please try again later.';
                console.error('Total Employees error:', err);
            },
        });

    // Fetch active employees
    this.http
        .get<{ activeEmployees: number }>('http://localhost:8080/api/employees/active/count')
        .subscribe({
            next: (data) => {
                this.activeEmployees = data.activeEmployees; // Access the activeEmployees property
            },
            error: (err) => {
                this.errorMessage = 'Failed to fetch active employees. Please try again later.';
                console.error('Active Employees error:', err);
            },
        });
}
}