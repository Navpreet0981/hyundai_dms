package com.hyundai.dms.service.impl;

import com.hyundai.dms.dto.LeadConversionDTO;
import com.hyundai.dms.repository.BookingRepository;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.TestDriveRepository;
import com.hyundai.dms.service.LeadConversionService;
import org.springframework.stereotype.Service;

// Fix #21: Extracted from inner class inside DealerDashboardServiceImpl
@Service
public class LeadConversionServiceImpl implements LeadConversionService {

    private final CustomerRepository customerRepository;
    private final TestDriveRepository testDriveRepository;
    private final BookingRepository bookingRepository;

    public LeadConversionServiceImpl(CustomerRepository customerRepository,
                                     TestDriveRepository testDriveRepository,
                                     BookingRepository bookingRepository) {
        this.customerRepository = customerRepository;
        this.testDriveRepository = testDriveRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public LeadConversionDTO getLeadConversionStats() {
        long leads = customerRepository.count();
        long testDrives = testDriveRepository.count();
        long bookings = bookingRepository.count();

        double leadToTestDriveRate = leads > 0 ? ((double) testDrives / leads) * 100 : 0;
        double leadToBookingRate = leads > 0 ? ((double) bookings / leads) * 100 : 0;
        double testDriveToBookingRate = testDrives > 0 ? ((double) bookings / testDrives) * 100 : 0;

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
