package com.example.ftafflySpring.Repository;

import com.example.ftafflySpring.Model.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
    List<LeaveRequest> findByEmployeeId(String employeeId); // Find all leave requests for an employee
}