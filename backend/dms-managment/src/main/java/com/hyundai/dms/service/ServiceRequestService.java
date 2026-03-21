package com.hyundai.dms.service;

import com.hyundai.dms.dto.ServiceRequestDTO;
import com.hyundai.dms.entity.*;
import com.hyundai.dms.mapper.ServiceRequestMapper;
import com.hyundai.dms.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final CarVariantRepository variantRepository;
    private final EmployeeRepository employeeRepository;

    public ServiceRequestService(ServiceRequestRepository requestRepository,
                                 CustomerRepository customerRepository,
                                 DealerRepository dealerRepository,
                                 CarVariantRepository variantRepository, EmployeeRepository employeeRepository) {

        this.requestRepository = requestRepository;
        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.variantRepository = variantRepository;
        this.employeeRepository = employeeRepository;
    }

    public ServiceRequestDTO createRequest(ServiceRequestDTO dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CarVariant variant = variantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        Employee employee = employeeRepository.findByEmail(
                SecurityContextHolder.getContext().getAuthentication().getName()
        ).orElseThrow(() -> new RuntimeException("Employee not found"));


        Dealer dealer = employee.getDealer();

        ServiceRequest request = ServiceRequest.builder()
                .serviceDate(dto.getServiceDate())
                .issueDescription(dto.getIssueDescription())
                .status(dto.getStatus())
                .customer(customer)
                .dealer(dealer)
                .employee(employee)
                .carVariant(variant)
                .build();

        ServiceRequest saved = requestRepository.save(request);

        return ServiceRequestMapper.toDTO(saved);
    }

    public List<ServiceRequestDTO> getAllRequests() {

        return requestRepository.findAll()
                .stream()
                .map(ServiceRequestMapper::toDTO)
                .collect(Collectors.toList());
    }

    public long getTotalServiceRequests() {
        return requestRepository.count();
    }

    public ServiceRequestDTO getRequestById(Long id) {

        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        return ServiceRequestMapper.toDTO(request);
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }

    public long getTotalServiceRequestsByRole() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return requestRepository.count();
        }

        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return requestRepository.countByEmployeeEmployeeId(employee.getEmployeeId());
        }

        if (role.equals("ROLE_DEALER")) {
            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return requestRepository.countByEmployeeDealerDealerId(dealer.getDealerId());
        }

        throw new RuntimeException("Unauthorized");
    }
}