package com.hyundai.dms.controller;

import com.hyundai.dms.service.BookingService;
import com.hyundai.dms.service.CustomerService;
import com.hyundai.dms.service.ServiceRequestService;
import com.hyundai.dms.service.TestDriveService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/employee/dashboard")
public class EmployeeDashboardController {

    private final CustomerService customerService;
    private final TestDriveService testDriveService;
    private final BookingService bookingService;
    private final ServiceRequestService serviceRequestService;

    public EmployeeDashboardController(
            CustomerService customerService,
            TestDriveService testDriveService,
            BookingService bookingService,
            ServiceRequestService serviceRequestService) {

        this.customerService = customerService;
        this.testDriveService = testDriveService;
        this.bookingService = bookingService;
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping
    public Map<String,Object> dashboard(){

        Map<String,Object> data = new HashMap<>();

        data.put("totalLeads", customerService.getTotalLeads());
        data.put("testDrives", testDriveService.getTotalTestDrives());
        data.put("bookings", bookingService.getTotalBookings());
        data.put("services", serviceRequestService.getTotalServiceRequests());

        return data;
    }
}