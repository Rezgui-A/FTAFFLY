package com.example.ftafflySpring.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;

@Data
@Document(collection = "leaveRequests")
public class LeaveRequest {
    @Id
    private String id; // Primary key
    private String employeeId; // ID of the employee requesting leave
    private LocalDate fromDate; // Start date of leave
    private LocalDate toDate; // End date of leave
    private String leaveType; // Type of leave (Earned, Sick, Casual, Leave Without Pay)
    private String reason; // Reason for leave
    private String status; // Status of the request (Pending, Approved, Rejected)
}