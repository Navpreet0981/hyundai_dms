package com.hyundai.dms.service.impl;

import com.hyundai.dms.dto.AdminSalesSummaryDTO;
import com.hyundai.dms.dto.SalesAnalyticsDTO;
import com.hyundai.dms.repository.SalesAnalyticsService;
import com.hyundai.dms.repository.BookingRepository;
import com.hyundai.dms.repository.TestDriveRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SalesAnalyticsServiceImpl implements SalesAnalyticsService {

    private final BookingRepository bookingRepository;
    private final TestDriveRepository testDriveRepository;

    public SalesAnalyticsServiceImpl(BookingRepository bookingRepository, TestDriveRepository testDriveRepository) {
        this.bookingRepository = bookingRepository;
        this.testDriveRepository = testDriveRepository;
    }

    // Month labels for charts
    private static final String[] MONTHS = {
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
    };

    @Override
    public List<SalesAnalyticsDTO> getMonthlySales() {

        List<Object[]> results = bookingRepository.getMonthlySales();
        List<SalesAnalyticsDTO> response = new ArrayList<>();

        for (Object[] row : results) {

            Integer month = (Integer) row[0];
            Long count = (Long) row[1];

            String monthName = MONTHS[month - 1];

            response.add(
                    SalesAnalyticsDTO.builder()
                            .period(monthName)
                            .totalBookings(count)
                            .build()
            );
        }

        return response;
    }

    @Override
    public List<SalesAnalyticsDTO> getYearlySales() {

        List<Object[]> results = bookingRepository.getYearlySales();
        List<SalesAnalyticsDTO> response = new ArrayList<>();

        for (Object[] row : results) {

            Integer year = (Integer) row[0];
            Long count = (Long) row[1];

            response.add(
                    SalesAnalyticsDTO.builder()
                            .period(String.valueOf(year))
                            .totalBookings(count)
                            .build()
            );
        }

        return response;
    }

    @Override
    public List<SalesAnalyticsDTO> getMonthlySalesByDealer(Long dealerId) {

        List<Object[]> results = bookingRepository.getMonthlySalesByDealer(dealerId);
        List<SalesAnalyticsDTO> response = new ArrayList<>();

        for (Object[] row : results) {

            Integer month = (Integer) row[0];
            Long count = (Long) row[1];

            String monthName = MONTHS[month - 1];

            response.add(
                    SalesAnalyticsDTO.builder()
                            .period(monthName)
                            .totalBookings(count)
                            .build()
            );
        }

        return response;
    }

    @Override
    public List<SalesAnalyticsDTO> getYearlySalesByDealer(Long dealerId) {

        List<Object[]> results = bookingRepository.getYearlySalesByDealer(dealerId);
        List<SalesAnalyticsDTO> response = new ArrayList<>();

        for (Object[] row : results) {

            Integer year = (Integer) row[0];
            Long count = (Long) row[1];

            response.add(
                    SalesAnalyticsDTO.builder()
                            .period(String.valueOf(year))
                            .totalBookings(count)
                            .build()
            );
        }

        return response;
    }

    @Override
    public List<Map<String,Object>> getSalesPerDealer(){

        List<Object[]> results = bookingRepository.getSalesPerDealer();

        List<Map<String,Object>> response = new ArrayList<>();

        for(Object[] row : results){

            String dealerName = (String) row[0];
            Long bookings = (Long) row[1];

            Map<String,Object> map = new HashMap<>();

            map.put("dealerName", dealerName);
            map.put("bookings", bookings);

            response.add(map);
        }

        return response;
    }


    @Override
    public Map<String,Object> getSalesSummary(){

        Long totalBookings = bookingRepository.getTotalBookings();
        Long totalTestDrives = testDriveRepository.getTotalTestDrives();
        Double totalRevenue = bookingRepository.getTotalRevenue();

        double conversionRate = 0;

        if(totalTestDrives > 0){
            conversionRate = (totalBookings * 100.0) / totalTestDrives;
            conversionRate = Math.round(conversionRate * 100.0) / 100.0;
        }

        Map<String,Object> map = new HashMap<>();

        map.put("totalBookings", totalBookings);
        map.put("totalRevenue", totalRevenue);
        map.put("testDrives", totalTestDrives);
        map.put("conversionRate", conversionRate);

        return map;
    }

    public AdminSalesSummaryDTO getAdminSummary(){

        Long bookings = bookingRepository.getTotalBookings();
        Long testDrives = testDriveRepository.getTotalTestDrives();
        Double revenue = bookingRepository.getTotalRevenue();

        double conversion = 0;

        if(testDrives != 0){
            conversion = (bookings * 100.0) / testDrives;
        }

        return AdminSalesSummaryDTO.builder()
                .totalBookings(bookings)
                .totalTestDrives(testDrives)
                .totalRevenue(revenue)
                .conversionRate(conversion)
                .build();
    }
}