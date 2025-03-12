package com.example.ftafflySpring.Controllers;

import com.example.ftafflySpring.Model.LeaveRequest;
import com.example.ftafflySpring.Services.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    /**
     * Create a new leave request.
     *
     * @param leaveRequest The leave request to create.
     * @return The created leave request.
     */
    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(@RequestBody LeaveRequest leaveRequest) {
        LeaveRequest createdRequest = leaveRequestService.createLeaveRequest(leaveRequest);
        return ResponseEntity.ok(createdRequest);
    }

    /**
     * Get all leave requests for an employee.
     *
     * @param employeeId The ID of the employee.
     * @return A list of leave requests.
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployeeId(@PathVariable String employeeId) {
        List<LeaveRequest> leaveRequests = leaveRequestService.getLeaveRequestsByEmployeeId(employeeId);
        return ResponseEntity.ok(leaveRequests);
    }
}