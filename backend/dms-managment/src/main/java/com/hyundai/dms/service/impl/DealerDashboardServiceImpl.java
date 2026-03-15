package com.hyundai.dms.service.impl;

import com.hyundai.dms.dto.DealerDashboardDTO;
import com.hyundai.dms.dto.LeadConversionDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.*;
import org.springframework.stereotype.Service;

@Service
public class DealerDashboardServiceImpl implements DealerDashboardService {

    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final TestDriveRepository testDriveRepository;
    private final BookingRepository bookingRepository;

    public DealerDashboardServiceImpl(
            DealerRepository dealerRepository,
            EmployeeRepository employeeRepository,
            CustomerRepository customerRepository,
            TestDriveRepository testDriveRepository,
            BookingRepository bookingRepository
    ) {
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.testDriveRepository = testDriveRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public DealerDashboardDTO getDealerDashboard(Long dealerId) {

        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        long employees =
                employeeRepository.countByDealerDealerId(dealerId);

        long leads =
                customerRepository.countByDealerDealerId(dealerId);

        long testDrives =
                testDriveRepository.countByDealerDealerId(dealerId);

        long bookings =
                bookingRepository.countByDealerDealerId(dealerId);

        double conversionRate = 0;

        if(leads > 0){
            conversionRate = ((double) bookings / leads) * 100;
        }

        return DealerDashboardDTO.builder()
                .dealerName(dealer.getDealerName())
                .totalEmployees(employees)
                .totalLeads(leads)
                .totalTestDrives(testDrives)
                .totalBookings(bookings)
                .conversionRate(conversionRate)
                .build();
    }

    @Service
    public static class LeadConversionServiceImpl implements LeadConversionService {

        private final CustomerRepository customerRepository;
        private final TestDriveRepository testDriveRepository;
        private final BookingRepository bookingRepository;

        public LeadConversionServiceImpl(
                CustomerRepository customerRepository,
                TestDriveRepository testDriveRepository,
                BookingRepository bookingRepository
        ) {
            this.customerRepository = customerRepository;
            this.testDriveRepository = testDriveRepository;
            this.bookingRepository = bookingRepository;
        }

        @Override
        public LeadConversionDTO getLeadConversionStats() {

            long leads = customerRepository.count();
            long testDrives = testDriveRepository.count();
            long bookings = bookingRepository.count();

            double leadToTestDriveRate = 0;
            double leadToBookingRate = 0;
            double testDriveToBookingRate = 0;

            if (leads > 0) {
                leadToTestDriveRate = ((double) testDrives / leads) * 100;
                leadToBookingRate = ((double) bookings / leads) * 100;
            }

            if (testDrives > 0) {
                testDriveToBookingRate = ((double) bookings / testDrives) * 100;
            }

            return LeadConversionDTO.builder()
                    .totalLeads(leads)
                    .totalTestDrives(testDrives)
                    .totalBookings(bookings)
                    .leadToTestDriveRate(leadToTestDriveRate)
                    .leadToBookingRate(leadToBookingRate)
                    .testDriveToBookingRate(testDriveToBookingRate)
                    .build();
        }
    }
}