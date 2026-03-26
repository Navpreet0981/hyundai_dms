package com.hyundai.dms.service;

import com.hyundai.dms.dto.DealerPerformanceDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.BookingRepository;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import com.hyundai.dms.repository.ServiceRequestRepository;
import com.hyundai.dms.repository.TestDriveRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

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

    // Save dealer
    public Dealer saveDealer(Dealer dealer) {
        dealer.setPassword(passwordEncoder.encode(dealer.getPassword()));
        return dealerRepository.save(dealer);
    }
    // Get all dealers
    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }

    // Fix #13: Throw instead of returning null silently
    public Dealer getDealerById(Long id) {
        return dealerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }

    // Fix #8: New method for toggling dealer active status
    public Dealer updateDealerStatus(Long id, Boolean active) {
        Dealer dealer = dealerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        dealer.setActive(active);
        return dealerRepository.save(dealer);
    }

    // Reassign all data from oldDealerId to newDealerId, then delete the old dealer
    @Transactional
    public void reassignAndDeleteDealer(Long oldDealerId, Long newDealerId) {
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

        dealerRepository.deleteById(oldDealerId);
    }

    // Delete dealer
    public void deleteDealer(Long id) {
        dealerRepository.deleteById(id);
    }

    public List<DealerPerformanceDTO> getDealerPerformance(){

        List<Dealer> dealers = dealerRepository.findAll();
        List<DealerPerformanceDTO> result = new ArrayList<>();

        for(Dealer d : dealers){

            Long employees = employeeRepository.countByDealer(d);
            Long leads = customerRepository.countByDealer(d);
            Long bookings = bookingRepository.countByDealer(d);

            double conversion = 0;

            if(leads > 0){
                conversion = (bookings * 100.0) / leads;
            }

            result.add(
                    DealerPerformanceDTO.builder()
                            .dealerId(d.getDealerId())
                            .dealerName(d.getDealerName())
                            .totalEmployees(employees)
                            .totalLeads(leads)
                            .totalBookings(bookings)
                            .conversionRate(Math.round(conversion*100)/100.0)
                            .active(d.getActive() != null && d.getActive())
                            .build()
            );
        }

        return result;
    }

    public Page<Dealer> getDealersPaged(String search, Pageable pageable) {

        //  Search
        if (search != null && !search.isEmpty()) {
            return dealerRepository
                    .searchDealers(search.toLowerCase(), pageable);
        }

        //  Default pagination
        return dealerRepository.findAll(pageable);
    }
}