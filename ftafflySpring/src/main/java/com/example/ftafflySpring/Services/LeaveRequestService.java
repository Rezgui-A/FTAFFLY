package com.example.ftafflySpring.Services;

import com.example.ftafflySpring.Model.LeaveRequest;
import com.example.ftafflySpring.Repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    /**
     * Create a new leave request.
     *
     * @param leaveRequest The leave request to create.
     * @return The created leave request.
     */
    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {
        leaveRequest.setStatus("Pending"); // Default status
        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Get all leave requests for an employee.
     *
     * @param employeeId The ID of the employee.
     * @return A list of leave requests.
     */
    public List<LeaveRequest> getLeaveRequestsByEmployeeId(String employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }
}