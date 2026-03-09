package com.hyundai.dms.service;

import com.hyundai.dms.dto.TestDriveDTO;
import com.hyundai.dms.entity.*;
import com.hyundai.dms.enums.TestDriveStatus;
import com.hyundai.dms.mapper.TestDriveMapper;
import com.hyundai.dms.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestDriveService {

    private final TestDriveRepository testDriveRepository;
    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final CarVariantRepository variantRepository;

    public TestDriveService(TestDriveRepository testDriveRepository,
                            CustomerRepository customerRepository,
                            DealerRepository dealerRepository,
                            EmployeeRepository employeeRepository,
                            CarVariantRepository variantRepository) {

        this.testDriveRepository = testDriveRepository;
        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.variantRepository = variantRepository;
    }

    public TestDriveDTO scheduleTestDrive(TestDriveDTO dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Dealer dealer = dealerRepository.findById(dto.getDealerId())
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        CarVariant variant = variantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        TestDrive testDrive = TestDrive.builder()
                .testDriveDate(dto.getTestDriveDate())
                .status(dto.getStatus())
                .customer(customer)
                .dealer(dealer)
                .employee(employee)
                .carVariant(variant)
                .build();

        TestDrive saved = testDriveRepository.save(testDrive);

        return TestDriveMapper.toDTO(saved);
    }

    public List<TestDriveDTO> getAllTestDrives() {

        return testDriveRepository.findAll()
                .stream()
                .map(TestDriveMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TestDriveDTO getTestDriveById(Long id) {

        TestDrive td = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test drive not found"));

        return TestDriveMapper.toDTO(td);
    }

    public TestDriveDTO updateStatus(Long id, String status) {

        TestDrive testDrive = testDriveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test drive not found"));

        try {
            TestDriveStatus newStatus = TestDriveStatus.valueOf(status.toUpperCase());
            testDrive.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }

        TestDrive saved = testDriveRepository.save(testDrive);

        return TestDriveMapper.toDTO(saved);
    }

    public void deleteTestDrive(Long id) {
        testDriveRepository.deleteById(id);
    }
}