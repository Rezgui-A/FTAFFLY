import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSizePipe } from "../../file-size.pipe";
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-work-report',
  templateUrl: './work-report.component.html',
  styleUrls: ['./work-report.component.css'],
  imports: [FileSizePipe, CommonModule],
})
export class WorkReportComponent implements OnInit {
  uploadedFiles: { id: string; fileName: string; fileSize: number; lastModified: string }[] = [];
  employeeId: string = ""; // No @Input()
  email: string = ""; // No @Input()

  constructor(
    private http: HttpClient, // Inject HttpClient
    private employeeService: EmployeeService,
    private authService: AuthService,
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
        this.fetchWorkReportsByEmployeeId(this.employeeId); // Fetch work reports after getting employeeId
      },
      error: (err) => {
        console.error('Failed to fetch employee ID:', err);
      },
    });
  }

  // Fetch work reports by employeeId
  fetchWorkReportsByEmployeeId(employeeId: string): void {
    this.http.get<{ id: string; fileName: string; fileSize: number; lastModified: string }[]>(
      `http://localhost:8080/api/work-reports/employee/${employeeId}`
    ).subscribe({
      next: (response) => {
        this.uploadedFiles = response; // Update the uploadedFiles array
      },
      error: (err) => {
        console.error('Failed to fetch work reports:', err);
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // Key must match @RequestParam in backend
      formData.append('employeeId', this.employeeId); // Use the fetched employeeId

      this.http.post<{ id: string; fileName: string; fileSize: number; lastModified: string }>(
        'http://localhost:8080/api/work-reports/upload', // Use full URL
        formData
      ).subscribe({
        next: (response) => {
          console.log('File uploaded:', response);
          this.uploadedFiles.push(response); // Add the new file to the list
        },
        error: (err) => {
          console.error('Failed to upload file:', err);
          alert('Failed to upload file. Please try again.'); // User-friendly error message
        },
      });
    }
  }

  downloadFile(id: string, fileName: string): void {
    this.http.get(`http://localhost:8080/api/work-reports/download/${id}`, { responseType: 'blob' })
      .subscribe({
        next: (response) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Failed to download file:', err);
          alert('Failed to download file. Please try again.'); // User-friendly error message
        },
      });
  }
}