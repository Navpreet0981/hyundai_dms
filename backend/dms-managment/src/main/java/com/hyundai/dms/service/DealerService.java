package com.hyundai.dms.service;

import com.hyundai.dms.dto.DealerPerformanceDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.BookingRepository;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class DealerService {

    private final DealerRepository dealerRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;

    public DealerService(DealerRepository dealerRepository, BookingRepository bookingRepository, CustomerRepository customerRepository, EmployeeRepository employeeRepository) {
        this.dealerRepository = dealerRepository;
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
    }

    // Save dealer
    public Dealer saveDealer(Dealer dealer) {
        return dealerRepository.save(dealer);
    }

    // Get all dealers
    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }

    // Get dealer by ID
    public Dealer getDealerById(Long id) {
        return dealerRepository.findById(id).orElse(null);
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
                            .active(d.isActive())
                            .build()
            );
        }

        return result;
    }

    public Page<Dealer> getDealersPaged(String search, Pageable pageable) {

        // ✅ Search
        if (search != null && !search.isEmpty()) {
            return dealerRepository
                    .searchDealers(search.toLowerCase(), pageable);
        }

        // ✅ Default pagination
        return dealerRepository.findAll(pageable);
    }
}