package com.hyundai.dms.service.impl;

import com.hyundai.dms.dto.DealerDashboardDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.*;
import com.hyundai.dms.service.DealerDashboardService;
import org.springframework.stereotype.Service;

@Service
public class DealerDashboardServiceImpl implements DealerDashboardService {

    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final TestDriveRepository testDriveRepository;
    private final BookingRepository bookingRepository;

    public DealerDashboardServiceImpl(DealerRepository dealerRepository,
                                      EmployeeRepository employeeRepository,
                                      CustomerRepository customerRepository,
                                      TestDriveRepository testDriveRepository,
                                      BookingRepository bookingRepository) {
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.testDriveRepository = testDriveRepository;
        this.bookingRepository = bookingRepository;
    }

    // Aggregates all dealer-scoped stats into a single typed DTO
    @Override
    public DealerDashboardDTO getDealerDashboard(Long dealerId) {
        // Resolve dealer entity to get name
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        // Count all entities scoped to this dealer
        long employees  = employeeRepository.countByDealerDealerId(dealerId);
        long leads      = customerRepository.countByEmployee_Dealer_DealerId(dealerId);
        long testDrives = testDriveRepository.countByEmployeeDealerDealerId(dealerId);
        long bookings   = bookingRepository.countByEmployeeDealerDealerId(dealerId);

        // Revenue: sum of variant prices for all bookings under this dealer
        Double revenue = bookingRepository.getTotalRevenueByDealer(dealerId);

        // Conversion rate: bookings / leads * 100
        double conversionRate = leads > 0 ? ((double) bookings / leads) * 100 : 0;

        return DealerDashboardDTO.builder()
                .dealerName(dealer.getDealerName())
                .totalEmployees(employees)
                .totalLeads(leads)
                .totalTestDrives(testDrives)
                .totalBookings(bookings)
                .conversionRate(Math.round(conversionRate * 100) / 100.0)
                .totalRevenue(revenue != null ? revenue : 0)
                .build();
    }
}
