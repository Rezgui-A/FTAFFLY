import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router'; // Import provideRouter and Routes
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { ManagerComponent } from './app/manager/manager.component';
import { EmployeeComponent } from './app/employee/employee.component';

// Define your routes
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'manager', component: ManagerComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
];

// Bootstrap the application with routes and HttpClient
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide the routes
    provideHttpClient(), // Provide HttpClient
  ],
}).catch((err) => console.error(err));