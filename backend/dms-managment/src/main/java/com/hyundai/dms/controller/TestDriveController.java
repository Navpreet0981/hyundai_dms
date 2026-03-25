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
    public TestDriveDTO getTestDrive(@PathVariable("id") Long id) {
        return testDriveService.getTestDriveById(id);
    }

    @PutMapping("/{id}/status")
    public TestDriveDTO updateStatus(
            @PathVariable("id") Long id,
            @RequestParam(name = "status") String status
    ) {
        return testDriveService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteTestDrive(@PathVariable("id") Long id) {
        testDriveService.deleteTestDrive(id);
    }

    @GetMapping("/paged")
    public Page<TestDriveDTO> getTestDrivesPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return testDriveService.getTestDrivesPaged(pageable);
    }
}
