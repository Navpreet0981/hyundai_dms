package com.hyundai.dms.service;

import com.hyundai.dms.dto.DealerPerformanceDTO;
import com.hyundai.dms.entity.Dealer;
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
    private final PasswordEncoder passwordEncoder;

    public DealerService(DealerRepository dealerRepository, BookingRepository bookingRepository,
                         CustomerRepository customerRepository, EmployeeRepository employeeRepository,
                         TestDriveRepository testDriveRepository, ServiceRequestRepository serviceRequestRepository,
                         PasswordEncoder passwordEncoder) {
        this.dealerRepository = dealerRepository;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.testDriveRepository = testDriveRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Encodes password and persists new dealer
    public Dealer saveDealer(Dealer dealer) {
        dealer.setPassword(passwordEncoder.encode(dealer.getPassword()));
        return dealerRepository.save(dealer);
    }

    // Returns all dealers regardless of active status
    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }

    // Finds dealer by ID or throws if not found
    public Dealer getDealerById(Long id) {
        return dealerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }

    // Toggles dealer active/inactive status (soft enable/disable)
    public Dealer updateDealerStatus(Long id, Boolean active) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        dealer.setActive(active);
        return dealerRepository.save(dealer);
    }

    // Soft deletes dealer by setting active=false — preserves all historical data
    public Dealer deactivateDealer(Long id) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        dealer.setActive(false);
        return dealerRepository.save(dealer);
    }

    // Bulk-reassigns all dealer data to target dealer, then soft-deactivates the old dealer
    @Transactional
    public void reassignAndDeactivateDealer(Long oldDealerId, Long newDealerId) {
        if (oldDealerId.equals(newDealerId)) {
            throw new RuntimeException("Cannot reassign to the same dealer");
        }

        // Validate target dealer exists before doing any work
        dealerRepository.findById(newDealerId)
                .orElseThrow(() -> new RuntimeException("Target dealer not found"));

        // Bulk-update all related records to point to the new dealer
        bookingRepository.reassignDealer(oldDealerId, newDealerId);
        testDriveRepository.reassignDealer(oldDealerId, newDealerId);
        customerRepository.reassignDealer(oldDealerId, newDealerId);
        serviceRequestRepository.reassignDealer(oldDealerId, newDealerId);
        employeeRepository.reassignDealer(oldDealerId, newDealerId);

        // Soft deactivate instead of hard delete — preserves audit trail
        Dealer old = dealerRepository.findById(oldDealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        old.setActive(false);
        dealerRepository.save(old);
    }

    // Returns per-dealer performance stats: employees, leads, bookings, conversion rate
    public List<DealerPerformanceDTO> getDealerPerformance() {
        List<Dealer> dealers = dealerRepository.findAll();
        List<DealerPerformanceDTO> result = new ArrayList<>();

        for (Dealer d : dealers) {
            Long employees = employeeRepository.countByDealer(d);
            Long leads     = customerRepository.countByDealer(d);
            Long bookings  = bookingRepository.countByDealer(d);

            // Conversion rate guarded against division by zero
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

    // Paginated dealer list with optional search across name, city, email
    public Page<Dealer> getDealersPaged(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return dealerRepository.searchDealers(search.toLowerCase(), pageable);
        }
        return dealerRepository.findAll(pageable);
    }
}
