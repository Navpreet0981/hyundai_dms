package com.hyundai.dms.controller;

import com.hyundai.dms.dto.TestDriveDTO;
import com.hyundai.dms.service.TestDriveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/testdrives")
public class TestDriveController {

    private final TestDriveService testDriveService;

    public TestDriveController(TestDriveService testDriveService) {
        this.testDriveService = testDriveService;
    }

    @PostMapping
    public TestDriveDTO scheduleTestDrive(@RequestBody TestDriveDTO dto) {
        return testDriveService.scheduleTestDrive(dto);
    }

    @GetMapping
    public List<TestDriveDTO> getAllTestDrives() {
        return testDriveService.getAllTestDrives();
    }

    @GetMapping("/{id}")
    public TestDriveDTO getTestDrive(@PathVariable Long id) {
        return testDriveService.getTestDriveById(id);
    }

    @PutMapping("/{id}/status")
    public TestDriveDTO updateStatus(@PathVariable Long id,
                                     @RequestParam String status) {
        return testDriveService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteTestDrive(@PathVariable Long id) {
        testDriveService.deleteTestDrive(id);
    }
}