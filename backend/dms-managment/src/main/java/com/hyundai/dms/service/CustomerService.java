package com.hyundai.dms.service;

import com.hyundai.dms.dto.CustomerDTO;
import com.hyundai.dms.entity.Customer;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.enums.LeadStatus;
import com.hyundai.dms.mapper.CustomerMapper;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            DealerRepository dealerRepository,
            EmployeeRepository employeeRepository) {

        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
    }

    // CREATE CUSTOMER (Employee)
    public CustomerDTO createCustomer(CustomerDTO dto) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Dealer dealer = employee.getDealer();

        Customer customer = CustomerMapper.toEntity(dto);

        customer.setEmployee(employee);
        customer.setDealer(dealer);
        customer.setLeadStatus(LeadStatus.NEW);
        customer.setCreatedDate(LocalDate.now());

        Customer saved = customerRepository.save(customer);

        return CustomerMapper.toDTO(saved);
    }

    // ROLE-BASED FETCH (CORE LOGIC)
    public List<CustomerDTO> getAllCustomers() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        //  ADMIN → all
        if (role.equals("ROLE_ADMIN")) {
            return customerRepository.findAll()
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        //  EMPLOYEE → own leads
        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return customerRepository.findByEmployee_EmployeeId(employee.getEmployeeId())
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        //  DEALER → all leads under dealer
        if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return customerRepository.findByEmployee_Dealer_DealerId(dealer.getDealerId())
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        throw new RuntimeException("Unauthorized access");
    }

    // ✅ SECURE GET BY ID
    public CustomerDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_EMPLOYEE")) {
            if (!customer.getEmployee().getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
        }

        if (role.equals("ROLE_DEALER")) {
            if (!customer.getDealer().getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
        }

        return mapToDTO(customer);
    }


    public void deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_EMPLOYEE")) {
            if (customer.getEmployee() == null ||
                    !customer.getEmployee().getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
        }

        if (role.equals("ROLE_DEALER")) {
            if (customer.getDealer() == null ||
                    !customer.getDealer().getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
        }

        customerRepository.delete(customer);
    }


    public CustomerDTO updateLeadStatus(Long id, String status) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        // ✅ EMPLOYEE restriction
        if (role.equals("ROLE_EMPLOYEE")) {
            if (customer.getEmployee() == null ||
                    !customer.getEmployee().getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
        }

        // ✅ DEALER restriction
        if (role.equals("ROLE_DEALER")) {
            if (customer.getDealer() == null ||
                    !customer.getDealer().getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
        }

        LeadStatus newStatus;

        try {
            newStatus = LeadStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid lead status value");
        }

        customer.setLeadStatus(newStatus);

        Customer saved = customerRepository.save(customer);

        return mapToDTO(saved);
    }

    private CustomerDTO mapToDTO(Customer c) {

        CustomerDTO dto = new CustomerDTO();

        dto.setCustomerId(c.getCustomerId());
        dto.setName(c.getName());
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setCity(c.getCity());
        dto.setLeadSource(c.getLeadSource());
        dto.setInterestedModel(c.getInterestedModel());
        dto.setLeadStatus(c.getLeadStatus());
        dto.setCreatedDate(c.getCreatedDate());

        if (c.getDealer() != null) {
            dto.setDealerId(c.getDealer().getDealerId());
        }

        if (c.getEmployee() != null) {
            dto.setEmployeeId(c.getEmployee().getEmployeeId());
            dto.setEmployeeName(c.getEmployee().getName());
        }

        return dto;
    }

    public long getTotalLeads() {
        return customerRepository.count();
    }

    public long getTotalLeadsByRole() {

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
            return customerRepository.count();
        }

        // ✅ EMPLOYEE → own
        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return customerRepository.countByEmployee_EmployeeId(employee.getEmployeeId());
        }

        // ✅ DEALER → all under dealer
        if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return customerRepository.countByEmployee_Dealer_DealerId(dealer.getDealerId());
        }

        throw new RuntimeException("Unauthorized");
    }

    public Page<CustomerDTO> getCustomersPaged(String search, Pageable pageable) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        // ✅ ADMIN
        if (role.equals("ROLE_ADMIN")) {

            if (search != null && !search.isEmpty()) {
                return customerRepository
                        .searchAll(search.toLowerCase(), pageable)
                        .map(this::mapToDTO);
            }

            return customerRepository.findAll(pageable)
                    .map(this::mapToDTO);
        }

        // ✅ EMPLOYEE
        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            if (search != null && !search.isEmpty()) {
                return customerRepository
                        .searchByEmployee(employee.getEmployeeId(), search.toLowerCase(), pageable)
                        .map(this::mapToDTO);
            }

            return customerRepository
                    .findByEmployee_EmployeeId(employee.getEmployeeId(), pageable)
                    .map(this::mapToDTO);
        }

        // ✅ DEALER
        if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            if (search != null && !search.isEmpty()) {
                return customerRepository
                        .searchByDealer(dealer.getDealerId(), search.toLowerCase(), pageable)
                        .map(this::mapToDTO);
            }

            return customerRepository
                    .findByEmployee_Dealer_DealerId(dealer.getDealerId(), pageable)
                    .map(this::mapToDTO);
        }

        throw new RuntimeException("Unauthorized access");
    }
}