package com.example.ftafflySpring.Repository;

import com.example.ftafflySpring.Model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    Optional<Employee> findByEmail(String email);

    long countByIsActive(boolean isActive);}