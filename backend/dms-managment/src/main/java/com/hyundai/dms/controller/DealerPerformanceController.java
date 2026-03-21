package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.repository.BookingRepository;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import com.hyundai.dms.repository.TestDriveRepository;
import com.hyundai.dms.security.util.CurrentUserUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dealer/performance")
public class DealerPerformanceController {

    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final TestDriveRepository testDriveRepository;
    private final CurrentUserUtil currentUserUtil;

    public DealerPerformanceController(
            EmployeeRepository employeeRepository,
            CustomerRepository customerRepository,
            BookingRepository bookingRepository,
            TestDriveRepository testDriveRepository,
            CurrentUserUtil currentUserUtil) {

        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.testDriveRepository = testDriveRepository;
        this.currentUserUtil = currentUserUtil;
    }

    @GetMapping
    public List<Map<String, Object>> getPerformance() {

        Long dealerId = currentUserUtil.getLoggedInDealerId();

        List<Employee> employees = employeeRepository.findByDealerDealerIdAndActiveTrueOrderByEmployeeIdAsc(dealerId);

        return employees.stream().map(emp -> {

            long leads = customerRepository.countByEmployee_EmployeeId(emp.getEmployeeId());
            long testDrives = testDriveRepository.countByEmployeeEmployeeId(emp.getEmployeeId());
            long bookings = bookingRepository.countByEmployeeEmployeeId(emp.getEmployeeId());

            double conversion = leads == 0 ? 0 : (bookings * 100.0 / leads);

            Map<String, Object> map = new HashMap<>();
            map.put("employeeName", emp.getName());
            map.put("totalLeads", leads);
            map.put("totalTestDrives", testDrives);
            map.put("totalBookings", bookings);
            map.put("conversionRate", Math.round(conversion));

            return map;
        }).toList();
    }
}