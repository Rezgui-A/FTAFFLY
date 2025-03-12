import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Get employee ID by email
  getIdByEmail(email: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/id-by-email`, {
      params: { email },
      responseType: 'text', // Ensure the response is treated as a string
    });
  }


  // Check in
  checkIn(employeeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${employeeId}/checkin`, {});
  }

  // Check out
  checkOut(employeeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${employeeId}/checkout`, {});
  }

  // Get daily worked time for the employee
  getDailyWorkedTime(employeeId: string): Observable<{ workedTimeToday: number }> {
    return this.http.get<{ workedTimeToday: number }>(`${this.apiUrl}/${employeeId}/daily-worked-time`);
  }
}


