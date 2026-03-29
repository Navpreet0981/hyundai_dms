package com.hyundai.dms.controller;

import com.hyundai.dms.dto.EmployeePerformanceDTO;
import com.hyundai.dms.repository.BookingRepository;
import com.hyundai.dms.security.util.CurrentUserUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dealer/performance")
public class DealerPerformanceController {

    private final BookingRepository bookingRepository;
    private final CurrentUserUtil currentUserUtil;

    public DealerPerformanceController(BookingRepository bookingRepository,
                                       CurrentUserUtil currentUserUtil) {
        this.bookingRepository = bookingRepository;
        this.currentUserUtil = currentUserUtil;
    }

    // GET /dealer/performance — per-employee performance stats using a single aggregated query (no N+1)
    @GetMapping
    public List<EmployeePerformanceDTO> getPerformance() {
        // Resolve logged-in dealer ID from JWT
        Long dealerId = currentUserUtil.getLoggedInDealerId();

        // Single JOIN query returns [employeeId, name, leads, testDrives, bookings] per employee
        List<Object[]> rows = bookingRepository.getEmployeePerformanceByDealer(dealerId);

        return rows.stream().map(row -> {
            long leads     = ((Number) row[2]).longValue();
            long testDrives = ((Number) row[3]).longValue();
            long bookings  = ((Number) row[4]).longValue();

            // Conversion rate: bookings / leads * 100, guarded against division by zero
            double conversion = leads == 0 ? 0 : Math.round((bookings * 100.0 / leads));

            return EmployeePerformanceDTO.builder()
                    .employeeId(((Number) row[0]).longValue())
                    .employeeName((String) row[1])
                    .totalLeads(leads)
                    .totalTestDrives(testDrives)
                    .totalBookings(bookings)
                    .conversionRate(conversion)
                    .build();
        }).collect(Collectors.toList());
    }
}
