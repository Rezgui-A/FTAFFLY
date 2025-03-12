package com.example.ftafflySpring.Repository;


import com.example.ftafflySpring.Model.WorkReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorkReportRepository extends MongoRepository<WorkReport, String> {
    List<WorkReport> findByEmployeeId(String employeeId);
}
