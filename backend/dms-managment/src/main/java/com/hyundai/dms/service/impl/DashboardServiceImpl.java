package com.hyundai.dms.service.impl;

import com.hyundai.dms.dto.DashboardDTO;
import com.hyundai.dms.repository.*;
import com.hyundai.dms.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;

    public DashboardServiceImpl(
            DealerRepository dealerRepository,
            EmployeeRepository employeeRepository,
            CustomerRepository customerRepository,
            BookingRepository bookingRepository
    ) {
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public DashboardDTO getDashboardStats() {

        long totalDealers = dealerRepository.count();
        long totalEmployees = employeeRepository.count();
        long totalCustomers = customerRepository.count();
        long totalBookings = bookingRepository.count();

        double conversionRate = 0;

        if(totalCustomers > 0){
            conversionRate = ((double) totalBookings / totalCustomers) * 100;
        }

        return DashboardDTO.builder()
                .totalDealers(totalDealers)
                .totalEmployees(totalEmployees)
                .totalCustomers(totalCustomers)
                .totalBookings(totalBookings)
                .leadConversionRate(conversionRate)
                .build();
    }
}