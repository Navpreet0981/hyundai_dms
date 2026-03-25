package com.hyundai.dms.service;

import com.hyundai.dms.dto.TestDriveDTO;
import com.hyundai.dms.entity.*;
import com.hyundai.dms.enums.TestDriveStatus;
import com.hyundai.dms.mapper.TestDriveMapper;
import com.hyundai.dms.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


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
                .status(TestDriveStatus.valueOf(dto.getStatus().toUpperCase()))
                .customer(customer)
                .dealer(dealer)
                .employee(employee)
                .carVariant(variant)
                .build();

        TestDrive saved = testDriveRepository.save(testDrive);

        return TestDriveMapper.toDTO(saved);
    }
    public long getTotalTestDrives() {
        return testDriveRepository.count();
    }
    public List<TestDriveDTO> getAllTestDrives() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        List<TestDrive> testDrives;

        // ✅ ADMIN → all test drives
        if (role.equals("ROLE_ADMIN")) {
            testDrives = testDriveRepository.findAll();
        }

        // ✅ EMPLOYEE → own test drives
        else if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            testDrives = testDriveRepository
                    .findByEmployeeEmployeeId(employee.getEmployeeId());
        }

        // ✅ DEALER → dealer's test drives
        else if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            testDrives = testDriveRepository
                    .findByEmployeeDealerDealerId(dealer.getDealerId());
        }

        // ❌ Unauthorized
        else {
            throw new RuntimeException("Unauthorized");
        }

        // ✅ Convert to DTO
        return testDrives.stream()
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

    public long getTotalTestDrivesByRole() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return testDriveRepository.count();
        }

        if (role.equals("ROLE_EMPLOYEE")) {
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return testDriveRepository.countByEmployeeEmployeeId(employee.getEmployeeId());
        }

        if (role.equals("ROLE_DEALER")) {
            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return testDriveRepository.countByEmployeeDealerDealerId(dealer.getDealerId());
        }

        throw new RuntimeException("Unauthorized");
    }

    public Page<TestDriveDTO> getTestDrivesPaged(Pageable pageable) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        // ✅ ADMIN → all
        if (role.equals("ROLE_ADMIN")) {
            return testDriveRepository.findAll(pageable)
                    .map(TestDriveMapper::toDTO);
        }

        // ✅ EMPLOYEE → own test drives
        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return testDriveRepository
                    .findByEmployeeEmployeeId(employee.getEmployeeId(), pageable)
                    .map(TestDriveMapper::toDTO);
        }

        // ✅ DEALER → dealer test drives
        if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return testDriveRepository
                    .findByEmployeeDealerDealerId(dealer.getDealerId(), pageable)
                    .map(TestDriveMapper::toDTO);
        }

        throw new RuntimeException("Unauthorized access");
    }
}