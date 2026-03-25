package com.hyundai.dms.service;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.enums.EmployeeStatus;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DealerRepository dealerRepository;
    private final PasswordEncoder passwordEncoder;
    public List<EmployeeDTO> getEmployeesByDealer(Long dealerId) {

        return employeeRepository
                .findByDealer_DealerIdAndStatus(dealerId, EmployeeStatus.ACTIVE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public EmployeeService(EmployeeRepository employeeRepository,
                           DealerRepository dealerRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.dealerRepository = dealerRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public EmployeeDTO getLoggedInEmployee(){

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        EmployeeDTO dto = new EmployeeDTO();

        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setRole(employee.getRole());

        if(employee.getDealer()!=null){
            dto.setDealerId(employee.getDealer().getDealerId());
            dto.setDealerName(employee.getDealer().getDealerName());
            dto.setDealerCity(employee.getDealer().getCity());
            dto.setDealerState(employee.getDealer().getState());
        }

        return dto;
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        // ✅ validations
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (employeeRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Employee already exists with this email");
        }

        Employee employee = new Employee();
        employee.setName(dto.getName().trim());
        employee.setEmail(dto.getEmail().toLowerCase());
        employee.setPhone(dto.getPhone().trim());
        employee.setRole(dto.getRole());
        employee.setDealer(dealer);
        employee.setActive(true);

        // ✅ set before save
        employee.setStatus(EmployeeStatus.ACTIVE);

        // 🔐 hashing
        employee.setPassword(passwordEncoder.encode(dto.getPassword()));

        Employee saved = employeeRepository.save(employee);

        return mapToDTO(saved);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDTO mapToDTO(Employee employee){

        EmployeeDTO dto = new EmployeeDTO();

        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setRole(employee.getRole());
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name() : null);
        if(employee.getDealer()!=null){

            dto.setDealerId(employee.getDealer().getDealerId());
            dto.setDealerName(employee.getDealer().getDealerName());
            dto.setDealerCity(employee.getDealer().getCity());
            dto.setDealerState(employee.getDealer().getState());

        }

        return dto;
    }

    public void deleteEmployee(Long employeeId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // 🔒 SECURITY CHECK
        if (employee.getDealer() == null ||
                !employee.getDealer().getDealerId().equals(dealer.getDealerId())) {

            throw new RuntimeException("Unauthorized");
        }

        // ✅ SOFT DELETE
        employee.setStatus(EmployeeStatus.INACTIVE);

        employeeRepository.save(employee);
    }

    public Page<EmployeeDTO> getEmployeesPaged(String search, Pageable pageable) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        // ✅ ADMIN → all employees
        if (role.equals("ROLE_ADMIN")) {

            if (search != null && !search.isEmpty()) {
                return employeeRepository
                        .searchAll(search.toLowerCase(), pageable)
                        .map(this::mapToDTO);
            }

            return employeeRepository.findAll(pageable)
                    .map(this::mapToDTO);
        }

        // ✅ DEALER → own ACTIVE employees
        if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            if (search != null && !search.isEmpty()) {
                return employeeRepository
                        .searchByDealer(
                                dealer.getDealerId(),
                                EmployeeStatus.ACTIVE,
                                search.toLowerCase(),
                                pageable
                        )
                        .map(this::mapToDTO);
            }

            return employeeRepository
                    .findByDealer_DealerIdAndStatus(
                            dealer.getDealerId(),
                            EmployeeStatus.ACTIVE,
                            pageable
                    )
                    .map(this::mapToDTO);
        }

        // ✅ EMPLOYEE → self
        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return employeeRepository
                    .findByEmployeeId(employee.getEmployeeId(), pageable)
                    .map(this::mapToDTO);
        }

        throw new RuntimeException("Unauthorized access");
    }
}