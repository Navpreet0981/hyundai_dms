package com.hyundai.dms.controller;

import com.hyundai.dms.dto.TestDriveDTO;
import com.hyundai.dms.service.TestDriveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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

    @GetMapping("/paged")
    public Page<TestDriveDTO> getTestDrivesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return testDriveService.getTestDrivesPaged(pageable);
    }
}