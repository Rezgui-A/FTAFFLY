package com.example.ftafflySpring.Controllers;

import com.example.ftafflySpring.Model.Employee;
import com.example.ftafflySpring.Services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Slf4j

public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable String id) {
        return employeeService.getEmployeeById(id);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalEmployees() {
        long totalEmployees = employeeService.getTotalEmployees();
        Map<String, Long> response = new HashMap<>();
        response.put("totalEmployees", totalEmployees);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active/count")
    public ResponseEntity<Map<String, Long>> getActiveEmployees() {
        long activeEmployees = employeeService.getActiveEmployees();
        Map<String, Long> response = new HashMap<>();
        response.put("activeEmployees", activeEmployees);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<Map<String, String>> checkIn(@PathVariable String id) {
        try {
            employeeService.checkIn(id);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Checked in successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    @PostMapping("/{id}/checkout")
    public ResponseEntity<Map<String, String>> checkOut(@PathVariable String id) {
        try {
            employeeService.checkOut(id);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Checked out successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }}
        
        @GetMapping("/{id}/daily-worked-time")
        public ResponseEntity<Map<String, Long>> getDailyWorkedTime(@PathVariable String id) {
            try {
                // Fetch the dailyWorkedTime map from the service
                Map<String, Long> dailyWorkedTime = employeeService.getDailyWorkedTime(id);
                return ResponseEntity.ok(dailyWorkedTime);
            } catch (RuntimeException e) {
                Map<String, Long> errorResponse = new HashMap<>();
                errorResponse.put("error", -1L); // Indicate an error
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
        }
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        Employee createdEmployee = employeeService.createEmployee(employee);

        if (createdEmployee == null) {
            // Return a 409 Conflict status with the error message
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Employee already has an account with this email.");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable String id, @RequestBody Employee employeeDetails) {
        return employeeService.updateEmployee(id, employeeDetails);
    }
    @GetMapping("/id-by-email")
    public ResponseEntity<?> getIdByEmail(@RequestParam String email) {
        try {
            String employeeId = employeeService.getIDbymail(email);
            return ResponseEntity.ok(employeeId); // Return the employee ID if found
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // Return 404 if employee not found
        }
    }
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
    }

@PostMapping("/signin")
public ResponseEntity<Map<String, String>> signIn(@RequestBody Map<String, String> credentials) {
    String email = credentials.get("email");
    String password = credentials.get("password");

    String role = employeeService.signIn(email, password);

    if (role != null) {
        Map<String, String> response = new HashMap<>();
        response.put("role", role);
        return ResponseEntity.ok(response); // Return 200 OK with role
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Return 401 Unauthorized
    }
}
}