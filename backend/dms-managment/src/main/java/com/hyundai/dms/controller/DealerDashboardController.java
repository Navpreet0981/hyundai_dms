package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// Fix #2: Removed unused DealerDashboardService and CurrentUserUtil injections
@RestController
@RequestMapping("/dealer")
public class DealerDashboardController {

    private final CustomerRepository customerRepository;
    private final TestDriveRepository testDriveRepository;
    private final BookingRepository bookingRepository;
    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;

    public DealerDashboardController(CustomerRepository customerRepository,
                                     TestDriveRepository testDriveRepository,
                                     BookingRepository bookingRepository,
                                     DealerRepository dealerRepository,
                                     EmployeeRepository employeeRepository) {
        this.customerRepository = customerRepository;
        this.testDriveRepository = testDriveRepository;
        this.bookingRepository = bookingRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        Long dealerId = dealer.getDealerId();

        Map<String, Object> data = new HashMap<>();
        data.put("totalLeads",     customerRepository.countByEmployee_Dealer_DealerId(dealerId));
        data.put("totalTestDrives",testDriveRepository.countByEmployeeDealerDealerId(dealerId));
        data.put("totalBookings",  bookingRepository.countByEmployeeDealerDealerId(dealerId));
        data.put("totalEmployees", employeeRepository.countByDealerDealerId(dealerId));
        Double revenue = bookingRepository.getTotalRevenueByDealer(dealerId);
        data.put("totalRevenue", revenue != null ? revenue : 0);
        return data;
    }
}
