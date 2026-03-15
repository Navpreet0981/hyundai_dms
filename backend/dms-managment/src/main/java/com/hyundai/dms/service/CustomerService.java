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
import com.hyundai.dms.repository.LeadAssignmentService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadAssignmentService leadAssignmentService;

    public CustomerService(
            CustomerRepository customerRepository,
            DealerRepository dealerRepository,
            EmployeeRepository employeeRepository,
            LeadAssignmentService leadAssignmentService) {

        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.leadAssignmentService = leadAssignmentService;
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {

        // Get logged in employee email from JWT
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find employee
        Employee employee = employeeRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Dealer comes from employee
        Dealer dealer = employee.getDealer();

        // Convert DTO → Entity
        Customer customer = CustomerMapper.toEntity(dto);

        // Set relationships
        customer.setEmployee(employee);
        customer.setDealer(dealer);

        // Default lead values
        customer.setLeadStatus(LeadStatus.NEW);
        customer.setCreatedDate(LocalDate.now());

        Customer saved = customerRepository.save(customer);

        return CustomerMapper.toDTO(saved);
    }

    public List<CustomerDTO> getAllCustomers() {

        return customerRepository
                .findAll()
                .stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {

        Customer customer = customerRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return CustomerMapper.toDTO(customer);
    }

    public long getTotalLeads() {
        return customerRepository.count();
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public CustomerDTO updateLeadStatus(Long id, String status) {

        Customer customer = customerRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        LeadStatus newStatus;

        try {
            newStatus = LeadStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid lead status value");
        }

        customer.setLeadStatus(newStatus);

        Customer saved = customerRepository.save(customer);

        return CustomerMapper.toDTO(saved);
    }
}