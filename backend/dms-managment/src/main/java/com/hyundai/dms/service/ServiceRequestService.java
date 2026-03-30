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
    private final EmployeeRepository employeeRepository;
    private final BookingRepository bookingRepository; // ✅ NEW

    public ServiceRequestService(ServiceRequestRepository requestRepository,
                                 CustomerRepository customerRepository,
                                 DealerRepository dealerRepository,
                                 EmployeeRepository employeeRepository,
                                 BookingRepository bookingRepository) {

        this.requestRepository = requestRepository;
        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.bookingRepository = bookingRepository;
    }

    public ServiceRequestDTO createRequest(ServiceRequestDTO dto) {

        //  STEP 1: Get Customer
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        //  STEP 2: Get Booking (VERY IMPORTANT)
        Booking booking = bookingRepository
                .findByCustomerCustomerId(customer.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer has no booking"));

        //  STEP 3: Get Variant FROM BOOKING
        CarVariant variant = booking.getCarVariant();

        if (variant == null) {
            throw new RuntimeException("No variant found for booking");
        }

        //  STEP 4: Auth check
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role  = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if (!role.equals("ROLE_EMPLOYEE")) {
            throw new RuntimeException("Only employees can create service requests");
        }

        //  STEP 5: Get employee + dealer
        Employee employee = employeeRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Dealer dealer = employee.getDealer();

        //  STEP 6: Create request
        ServiceRequest request = ServiceRequest.builder()
                .serviceDate(dto.getServiceDate())
                .issueDescription(dto.getIssueDescription())
                .status(dto.getStatus())
                .customer(customer)
                .dealer(dealer)
                .employee(employee)
                .carVariant(variant) // ✅ auto assigned
                .build();

        ServiceRequest saved = requestRepository.save(request);

        return ServiceRequestMapper.toDTO(saved);
    }

    public List<ServiceRequestDTO> getAllRequests() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        List<ServiceRequest> requests;

        if (role.equals("ROLE_ADMIN")) {
            requests = requestRepository.findAll();
        }

        else if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByUser_Email(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            requests = requestRepository.findByEmployeeEmployeeId(employee.getEmployeeId());
        }

        else if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByUser_Email(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            requests = requestRepository.findByDealerDealerId(dealer.getDealerId());
        }

        else {
            throw new RuntimeException("Unauthorized");
        }

        return requests.stream()
                .map(ServiceRequestMapper::toDTO)
                .collect(Collectors.toList());
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

            Employee employee = employeeRepository.findByUser_Email(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return requestRepository.countByEmployeeEmployeeId(employee.getEmployeeId());
        }

        if (role.equals("ROLE_DEALER")) {
            Dealer dealer = dealerRepository.findByUser_Email(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return requestRepository.countByEmployeeDealerDealerId(dealer.getDealerId());
        }

        throw new RuntimeException("Unauthorized");
    }
}