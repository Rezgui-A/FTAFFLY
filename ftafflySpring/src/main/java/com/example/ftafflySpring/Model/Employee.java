package com.example.ftafflySpring.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Document(collection = "employees")
@Getter
@Setter
public class Employee {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // Encrypted password
    private String role; // MANAGER or EMPLOYEE
    private boolean isActive;
    private LocalDateTime checkInTime; // Store check-in time as LocalDateTime
    private Map<String, Long> dailyWorkedTime = new HashMap<>(); // Map to store worked time per day
}