import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

type DailyWorkedTime = { [key: string]: number };

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  imports: [CommonModule],
})
export class AttendanceComponent implements OnInit, OnDestroy {
  employeeId: string = ""; // No @Input()
  email: string = ""; // No @Input()
  isCheckedIn: boolean = false;
  timeCounter: number = 0;
  totalWorkedTimeToday: number = 0;
  private timer: any;
  checkInTime: string = '';

  // Metrics to display
  daysRegistered: number = 0;
  absenceDays: number = 0;
  attendanceRate: number = 0;
  totalTimeWorkedInHours: number = 0;

  // Daily worked time map
  dailyWorkedTime: { [key: string]: number } = {};

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService, // Inject AuthService
    private cdr: ChangeDetectorRef
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
    this.setMidnightReset(); // Only set the midnight reset
  }

  // Fetch employeeId using email
  fetchEmployeeId(email: string): void {
    this.employeeService.getIdByEmail(this.email).subscribe({
      next: (id) => {
        this.employeeId = id;
        this.fetchDailyWorkedTime();

        // Check for midnight reset
        this.setMidnightReset();
      },
      error: (err) => {
        console.error('Failed to fetch employee ID:', err);
      },
    });
  }

  fetchDailyWorkedTime(): void {
    if (!this.employeeId) {
      console.error('Employee ID is missing.');
      return;
    }

    this.employeeService.getDailyWorkedTime(this.employeeId).subscribe({
      next: (response: DailyWorkedTime) => {
        console.log('Fetched daily worked time:', response);

        // Calculate metrics from the dailyWorkedTime map
        this.calculateMetrics(response);

        // Set the total worked time for today
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        this.totalWorkedTimeToday = response[today] || 0; // Set the total worked time for the day
        this.timeCounter = this.totalWorkedTimeToday; // Initialize timeCounter with workedTimeToday

        // Start the timer if the employee is already checked in
        if (this.isCheckedIn) {
          this.startTimer();
        }

        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Failed to fetch daily worked time:', err);
      },
    });
  }

  calculateMetrics(dailyWorkedTime: DailyWorkedTime): void {
    const days = Object.keys(dailyWorkedTime);
    this.daysRegistered = days.length; // Total days registered

    // Calculate absence days (days with 0 worked time)
    this.absenceDays = Object.values(dailyWorkedTime).filter(time => time === 0).length;

    // Calculate attendance rate
    this.attendanceRate = ((this.daysRegistered - this.absenceDays) / this.daysRegistered) * 100;

    // Calculate total time worked in hours
    const totalSeconds = Object.values(dailyWorkedTime).reduce((sum, time) => sum + time, 0);
    this.totalTimeWorkedInHours = totalSeconds / 3600; // Convert seconds to hours
  }

  setMidnightReset(): void {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to next midnight

    const timeUntilMidnight = midnight.getTime() - now.getTime();

    // Schedule the reset at midnight
    setTimeout(() => {
      this.resetTimer(); // Reset the timer at midnight
      this.totalWorkedTimeToday = 0; // Reset the total worked time for the day
      this.cdr.detectChanges();
      this.setMidnightReset(); // Schedule the next midnight reset
    }, timeUntilMidnight);
  }

  resetTimer(): void {
    this.timeCounter = 0; // Reset the elapsed time counter
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  getDailyStatus(): { date: string, status: string, hoursWorked: number }[] {
    return Object.entries(this.dailyWorkedTime).map(([date, seconds]) => {
      const hoursWorked = seconds / 3600; // Convert seconds to hours
      const status = seconds > 0 ? 'PRESENT' : 'ABSENT'; // Determine status
      return { date, status, hoursWorked };
    });
  }

  checkIn(): void {
    if (!this.employeeId) {
      console.error('Employee ID is missing.');
      return;
    }

    this.employeeService.checkIn(this.employeeId).subscribe({
      next: (response) => {
        this.isCheckedIn = true;
        this.checkInTime = this.formatCheckInTime(response.checkInTime);
        this.startTimer(); // Start the elapsed time counter
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to check in:', err);
        alert('You are already checked in.'); // Inform the user
      },
    });
  }

  checkOut(): void {
    if (!this.employeeId) {
      console.error('Employee ID is missing.');
      return;
    }

    this.employeeService.checkOut(this.employeeId).subscribe({
      next: (response) => {
        this.isCheckedIn = false;
        this.stopTimer(); // Stop the elapsed time counter

        // Update the total worked time for the day
        this.totalWorkedTimeToday = response.workedTimeToday || 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to check out:', err);
        alert('An error occurred while checking out.'); // Display a generic error message
      },
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.isCheckedIn) {
        this.timeCounter += 1; // Increment the elapsed time counter
        this.totalWorkedTimeToday = this.timeCounter; // Update total worked time
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.timer); // Stop the elapsed time counter
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  formatCheckInTime(checkInDateTime: string | Date): string {
    const date = new Date(checkInDateTime); // Ensure it's a Date object
    const day = this.pad(date.getUTCDate());
    const month = this.pad(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();
    const hours = this.pad(date.getUTCHours());
    const minutes = this.pad(date.getUTCMinutes());
    const seconds = this.pad(date.getUTCSeconds());
    return `${day}:${month}:${year}:${hours}:${minutes}:${seconds}`;
  }

  ngOnDestroy(): void {
    this.stopTimer(); // Clean up the timer when the component is destroyed
  }
}