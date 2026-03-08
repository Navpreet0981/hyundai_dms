package com.hyundai.dms.service;

import com.hyundai.dms.dto.CustomerDTO;
import com.hyundai.dms.entity.Customer;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.mapper.CustomerMapper;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final LeadAssignmentService leadAssignmentService;

    public CustomerService(CustomerRepository customerRepository,
                           DealerRepository dealerRepository,
                           LeadAssignmentService leadAssignmentService) {

        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.leadAssignmentService = leadAssignmentService;
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {

        // Validate dealer
        Dealer dealer = dealerRepository.findById(dto.getDealerId())
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        // Automatically assign employee
        Employee employee = leadAssignmentService.assignEmployee(dto.getDealerId());

        Customer customer = CustomerMapper.toEntity(dto);

        // Set relationships
        customer.setDealer(dealer);
        customer.setEmployee(employee);

        // Set created date automatically
        customer.setCreatedDate(LocalDate.now());

        Customer saved = customerRepository.save(customer);

        return CustomerMapper.toDTO(saved);
    }

    public List<CustomerDTO> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return CustomerMapper.toDTO(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}