package com.hyundai.dms.service;

import com.hyundai.dms.dto.DealerPerformanceDTO;
import com.hyundai.dms.dto.DealerRequest;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.User;
import com.hyundai.dms.enums.UserRole;
import com.hyundai.dms.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DealerService {

    private final DealerRepository dealerRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final TestDriveRepository testDriveRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DealerService(DealerRepository dealerRepository,
                         BookingRepository bookingRepository,
                         CustomerRepository customerRepository,
                         EmployeeRepository employeeRepository,
                         TestDriveRepository testDriveRepository,
                         ServiceRequestRepository serviceRequestRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
        this.dealerRepository = dealerRepository;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.testDriveRepository = testDriveRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Creates a new dealer:
     * 1. Creates a User record (auth credentials)
     * 2. Creates a Dealer profile linked to that user and the admin who created it
     */
    @Transactional
    public Dealer createDealer(DealerRequest request, User adminUser) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("A user with this email already exists");
        }

        // Step 1: create auth user for the dealer
        User dealerUser = User.builder()
                .name(request.getDealerName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .systemRole(UserRole.DEALER)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        User savedUser = userRepository.save(dealerUser);

        // Step 2: create dealer profile
        Dealer dealer = Dealer.builder()
                .user(savedUser)
                .managedBy(adminUser)
                .dealerName(request.getDealerName())
                .phone(request.getPhone())
                .city(request.getCity())
                .state(request.getState())
                .address(request.getAddress())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return dealerRepository.save(dealer);
    }

    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }

    public Dealer getDealerById(Long id) {
        return dealerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }

    public Dealer updateDealerStatus(Long id, Boolean active) {
        Dealer dealer = getDealerById(id);
        dealer.setActive(active);
        // Also update the linked user's active status
        dealer.getUser().setActive(active);
        userRepository.save(dealer.getUser());
        return dealerRepository.save(dealer);
    }

    public Dealer deactivateDealer(Long id) {
        return updateDealerStatus(id, false);
    }

    @Transactional
    public void reassignAndDeactivateDealer(Long oldDealerId, Long newDealerId) {
        if (oldDealerId.equals(newDealerId)) {
            throw new RuntimeException("Cannot reassign to the same dealer");
        }

        dealerRepository.findById(newDealerId)
                .orElseThrow(() -> new RuntimeException("Target dealer not found"));

        bookingRepository.reassignDealer(oldDealerId, newDealerId);
        testDriveRepository.reassignDealer(oldDealerId, newDealerId);
        customerRepository.reassignDealer(oldDealerId, newDealerId);
        serviceRequestRepository.reassignDealer(oldDealerId, newDealerId);
        employeeRepository.reassignDealer(oldDealerId, newDealerId);

        deactivateDealer(oldDealerId);
    }

    public List<DealerPerformanceDTO> getDealerPerformance() {
        List<Dealer> dealers = dealerRepository.findAll();
        List<DealerPerformanceDTO> result = new ArrayList<>();

        for (Dealer d : dealers) {
            Long employees = employeeRepository.countByDealer(d);
            Long leads     = customerRepository.countByDealer(d);
            Long bookings  = bookingRepository.countByDealer(d);
            double conversion = leads > 0 ? (bookings * 100.0) / leads : 0;

            result.add(DealerPerformanceDTO.builder()
                    .dealerId(d.getDealerId())
                    .dealerName(d.getDealerName())
                    .totalEmployees(employees)
                    .totalLeads(leads)
                    .totalBookings(bookings)
                    .conversionRate(Math.round(conversion * 100) / 100.0)
                    .active(d.getActive() != null && d.getActive())
                    .build());
        }

        return result;
    }

    public Page<Dealer> getDealersPaged(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return dealerRepository.searchDealers(search.toLowerCase(), pageable);
        }
        return dealerRepository.findAll(pageable);
    }
}
