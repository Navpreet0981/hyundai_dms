package com.hyundai.dms.service;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.entity.User;
import com.hyundai.dms.enums.EmployeeStatus;
import com.hyundai.dms.enums.UserRole;
import com.hyundai.dms.repository.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final TestDriveRepository testDriveRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DealerRepository dealerRepository,
                           UserRepository userRepository,
                           BookingRepository bookingRepository,
                           CustomerRepository customerRepository,
                           TestDriveRepository testDriveRepository,
                           ServiceRequestRepository serviceRequestRepository,
                           PasswordEncoder passwordEncoder,
                           @Lazy AuditService auditService) {
        this.employeeRepository = employeeRepository;
        this.dealerRepository = dealerRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.testDriveRepository = testDriveRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    // ─── Helper: resolve logged-in dealer from SecurityContext ───────────────

    private Dealer resolveLoggedInDealer() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return dealerRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }

    private Employee resolveLoggedInEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // ─── Public methods ───────────────────────────────────────────────────────

    public List<EmployeeDTO> getEmployeesByDealer(Long dealerId) {
        return employeeRepository
                .findByDealer_DealerIdAndStatus(dealerId, EmployeeStatus.ACTIVE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void reassignAndDeleteEmployee(Long oldEmployeeId, Long newEmployeeId) {
        if (oldEmployeeId.equals(newEmployeeId)) {
            throw new RuntimeException("Cannot reassign to the same employee");
        }

        Dealer dealer = resolveLoggedInDealer();

        Employee oldEmployee = employeeRepository.findById(oldEmployeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Employee newEmployee = employeeRepository.findById(newEmployeeId)
                .orElseThrow(() -> new RuntimeException("Target employee not found"));

        if (!oldEmployee.getDealer().getDealerId().equals(dealer.getDealerId()) ||
                !newEmployee.getDealer().getDealerId().equals(dealer.getDealerId())) {
            throw new RuntimeException("Unauthorized");
        }

        bookingRepository.reassignEmployee(oldEmployeeId, newEmployeeId);
        testDriveRepository.reassignEmployee(oldEmployeeId, newEmployeeId);
        customerRepository.reassignEmployee(oldEmployeeId, newEmployeeId);
        serviceRequestRepository.reassignEmployee(oldEmployeeId, newEmployeeId);

        oldEmployee.setStatus(EmployeeStatus.INACTIVE);
        oldEmployee.getUser().setActive(false);
        userRepository.save(oldEmployee.getUser());
        employeeRepository.save(oldEmployee);
    }

    public EmployeeDTO getLoggedInEmployee() {
        Employee employee = resolveLoggedInEmployee();
        return mapToDTO(employee);
    }

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        Dealer dealer = resolveLoggedInDealer();

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Employee already exists with this email");
        }

        // Step 1: create auth user
        User empUser = User.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().toLowerCase())
                .password(passwordEncoder.encode(dto.getPassword()))
                .systemRole(UserRole.EMPLOYEE)
                .active(true)
                .build();
        User savedUser = userRepository.save(empUser);

        // Step 2: create employee profile
        Employee employee = Employee.builder()
                .user(savedUser)
                .dealer(dealer)
                .role(dto.getRole())
                .status(EmployeeStatus.ACTIVE)
                .build();

        Employee saved = employeeRepository.save(employee);

        auditService.log(dealer.getEmail(), "DEALER", dealer.getDealerId(), dealer.getDealerName(),
                "CREATE", "Employee", String.valueOf(saved.getEmployeeId()),
                "Added employee: " + saved.getName() + " (" + saved.getRole() + ")");

        return mapToDTO(saved);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteEmployee(Long employeeId) {
        Dealer dealer = resolveLoggedInDealer();

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getDealer() == null ||
                !employee.getDealer().getDealerId().equals(dealer.getDealerId())) {
            throw new RuntimeException("Unauthorized");
        }

        employee.setStatus(EmployeeStatus.INACTIVE);
        employee.getUser().setActive(false);
        userRepository.save(employee.getUser());
        employeeRepository.save(employee);

        auditService.log(dealer.getEmail(), "DEALER", dealer.getDealerId(), dealer.getDealerName(),
                "DELETE", "Employee", String.valueOf(employeeId),
                "Deactivated employee: " + employee.getName());
    }

    public void changePassword(String currentPassword, String newPassword) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        Employee employee = employeeRepository.findByUser_Email(email).orElse(null);
        if (employee != null) {
            auditService.logFromContext("UPDATE", "Employee",
                    String.valueOf(employee.getEmployeeId()), "Employee changed their password");
        }
    }

    public Page<EmployeeDTO> getEmployeesPaged(String search, Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities()
                .iterator().next().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            if (search != null && !search.isEmpty()) {
                return employeeRepository.searchAll(search.toLowerCase(), pageable).map(this::mapToDTO);
            }
            return employeeRepository.findAll(pageable).map(this::mapToDTO);
        }

        if (role.equals("ROLE_DEALER")) {
            Dealer dealer = dealerRepository.findByUser_Email(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            if (search != null && !search.isEmpty()) {
                return employeeRepository
                        .searchByDealer(dealer.getDealerId(), EmployeeStatus.ACTIVE, search.toLowerCase(), pageable)
                        .map(this::mapToDTO);
            }
            return employeeRepository
                    .findByDealer_DealerIdAndStatus(dealer.getDealerId(), EmployeeStatus.ACTIVE, pageable)
                    .map(this::mapToDTO);
        }

        if (role.equals("ROLE_EMPLOYEE")) {
            Employee employee = employeeRepository.findByUser_Email(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            return employeeRepository.findByEmployeeId(employee.getEmployeeId(), pageable).map(this::mapToDTO);
        }

        throw new RuntimeException("Unauthorized access");
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private EmployeeDTO mapToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setRole(employee.getRole());
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name() : null);

        if (employee.getDealer() != null) {
            dto.setDealerId(employee.getDealer().getDealerId());
            dto.setDealerName(employee.getDealer().getDealerName());
            dto.setDealerCity(employee.getDealer().getCity());
            dto.setDealerState(employee.getDealer().getState());
        }

        return dto;
    }
}
