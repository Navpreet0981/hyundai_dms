package com.hyundai.dms.analytics;

import com.hyundai.dms.repository.*;
import org.springframework.stereotype.Service;

@Service
public class LeadConversionServiceImpl implements LeadConversionService {

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