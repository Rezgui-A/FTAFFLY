package com.example.ftafflySpring.Services;

import com.example.ftafflySpring.Model.WorkReport;
import com.example.ftafflySpring.Repository.WorkReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkReportService {

    @Autowired
    private WorkReportRepository workReportRepository;

    private final Path rootLocation = Paths.get("uploads"); // Directory to store uploaded files

    public WorkReportService() {
        init();
    }

    private void init() {
        try {
            Files.createDirectories(rootLocation); // Create the upload directory if it doesn't exist
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }

    /**
     * Upload a file and save its metadata in MongoDB.
     *
     * @param file       The file to upload.
     * @param employeeId The ID of the employee uploading the file.
     * @return The saved WorkReport object.
     */
    public WorkReport uploadFile(MultipartFile file, String employeeId) throws IOException {
        // Save the file to the file system
        String fileName = file.getOriginalFilename();
        Path filePath = this.rootLocation.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Save file metadata in MongoDB
        WorkReport workReport = new WorkReport();
        workReport.setFileName(fileName);
        workReport.setFileSize(file.getSize());
        workReport.setLastModified(LocalDateTime.now());
        workReport.setFilePath(filePath.toString());
        workReport.setEmployeeId(employeeId); // Associate the file with the employee

        return workReportRepository.save(workReport);
    }

    /**
     * Retrieve all work reports for a specific employee.
     *
     * @param employeeId The ID of the employee.
     * @return A list of WorkReport objects.
     */
    public List<WorkReport> getWorkReportsByEmployee(String employeeId) {
        return workReportRepository.findByEmployeeId(employeeId);
    }

    /**
     * Retrieve the file path for a specific work report.
     *
     * @param id The ID of the work report.
     * @return The file path.
     */
    public Path getFilePath(String id) {
        WorkReport workReport = workReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work report not found"));
        return Paths.get(workReport.getFilePath());
    }
}