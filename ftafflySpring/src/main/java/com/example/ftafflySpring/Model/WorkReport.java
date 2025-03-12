package com.example.ftafflySpring.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Data


@Document(collection = "work_reports") // MongoDB collection name
@Getter
@Setter
public class WorkReport {
    @Id
    private String id; // MongoDB uses String as the ID type
    private String employeeId;
    private String fileName;
    private Long fileSize;
    private LocalDateTime lastModified;
    private String filePath; // Path to the actual file in the file system

    // Getters and setters
}