package com.example.ftafflySpring.Controllers;

import com.example.ftafflySpring.Model.WorkReport;
import com.example.ftafflySpring.Services.WorkReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/work-reports")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")

public class WorkReportController {

    @Autowired
    private WorkReportService workReportService;

    /**
     * Upload a file.
     *
     * @param file       The file to upload.
     * @param employeeId The ID of the employee uploading the file.
     * @return The saved WorkReport object.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("employeeId") String employeeId) {
        try {
            // Validate input
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty.");
            }
            if (employeeId == null || employeeId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Employee ID is required.");
            }

            // Upload the file
            WorkReport workReport = workReportService.uploadFile(file, employeeId);
            return ResponseEntity.ok(workReport);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    /**
     * Retrieve all work reports for a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @return A list of WorkReport objects.
     */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getWorkReportsByEmployee(@PathVariable String employeeId) {
        try {
            // Validate input
            if (employeeId == null || employeeId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Employee ID is required.");
            }

            // Fetch work reports
            List<WorkReport> workReports = workReportService.getWorkReportsByEmployee(employeeId);
            return ResponseEntity.ok(workReports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch work reports: " + e.getMessage());
        }
    }

    /**
     * Download a file.
     *
     * @param id The ID of the work report.
     * @return The file as a downloadable resource.
     */
    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable String id) {
        try {
            // Validate input
            if (id == null || id.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Work report ID is required.");
            }

            // Fetch the file
            Path filePath = workReportService.getFilePath(id);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("File not found or cannot be read.");
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to download file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }
}