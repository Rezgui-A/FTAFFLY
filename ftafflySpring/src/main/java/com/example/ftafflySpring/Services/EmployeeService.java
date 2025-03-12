package com.example.ftafflySpring.Services;

import com.example.ftafflySpring.Model.Employee;
import com.example.ftafflySpring.Repository.EmployeeRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;
    


    // Check-in logic
public ResponseEntity<Map<String, String>> checkIn(String employeeId) {
    Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

    if (employee.getCheckInTime() != null) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Employee is already checked in.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // Return 400 Bad Request
    }

    LocalDateTime checkInTime = LocalDateTime.now();
    employee.setCheckInTime(checkInTime);
    employeeRepository.save(employee);

    Map<String, String> response = new HashMap<>();
    response.put("status", "success");
    response.put("checkInTime", checkInTime.toString()); // Return the check-in time
    return ResponseEntity.ok(response); // Return 200 OK
}

public ResponseEntity<Map<String, String>> checkOut(String employeeId) {
    try {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Calculate worked time
        LocalDateTime checkInTime = employee.getCheckInTime();
        if (checkInTime == null) {
            throw new RuntimeException("Employee has not checked in.");
        }

        LocalDateTime checkOutTime = LocalDateTime.now();
        long workedTimeInSeconds = Duration.between(checkInTime, checkOutTime).getSeconds(); // Worked time in seconds

        // Update daily worked time
        String today = LocalDate.now().toString(); // Get today's date as a string
        long existingWorkedTime = employee.getDailyWorkedTime().getOrDefault(today, 0L); // Get existing worked time for today
        long totalWorkedTimeToday = existingWorkedTime + workedTimeInSeconds; // Add new worked time
        employee.getDailyWorkedTime().put(today, totalWorkedTimeToday); // Update the map

        // Reset check-in time
        employee.setCheckInTime(null);
        employeeRepository.save(employee);

        // Return success response
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Checked out successfully");
        response.put("workedTimeToday", String.valueOf(totalWorkedTimeToday)); // Return total worked time for today
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}

public Map<String, Long> getDailyWorkedTime(String employeeId) {
    Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

    return employee.getDailyWorkedTime(); // Return the dailyWorkedTime map
}

    public String getIDbymail(String email) {
        Optional<Employee> employeeOptional = employeeRepository.findByEmail(email);

        if (employeeOptional.isPresent()) {
            return employeeOptional.get().getId(); // Return the employee ID if found
        } else {
            throw new RuntimeException("Employee not found with email: " + email); // Throw an exception if not found
        }
    }
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    public long getTotalEmployees() {
        return employeeRepository.count();
    }
    public long getActiveEmployees() {
        return employeeRepository.countByIsActive(true); // Count employees where isActive is true
    }

    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public Employee createEmployee(Employee employee) {
        // Check if email already exists
        Optional<Employee> existingEmployee = employeeRepository.findByEmail(employee.getEmail());
        if (existingEmployee.isPresent()) {
            return null; // Indicate that the email already exists
        }

        // Save the employee if email is unique
        return employeeRepository.save(employee);
    }
    
    @PostConstruct
    public void init() {
        // Add a default manager if not already present
        if (employeeRepository.findByEmail("manager@example.com").isEmpty()) {
            Employee manager = new Employee();
            manager.setFirstName("Admin");
            manager.setLastName("Manager");
            manager.setEmail("manager@example.com");
            manager.setPassword(("manager123")); // Encrypt password
            manager.setRole("MANAGER");
            manager.setActive(true);
            employeeRepository.save(manager);
        }
    }
    public Employee updateEmployee(String id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setRole(employeeDetails.getRole());
        employee.setActive(employeeDetails.isActive());
        return employeeRepository.save(employee);
    }


    public String signIn(String email, String password) {
        Optional<Employee> optionalEmployee = employeeRepository.findByEmail(email);
    
        if (optionalEmployee.isPresent() && optionalEmployee.get().getPassword().equals(password)) {
            return optionalEmployee.get().getRole(); // Return role if credentials are valid
        } else {
            return null; // Return null if credentials are invalid
        }
    }

    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }

}