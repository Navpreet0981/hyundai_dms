package com.hyundai.dms.analytics;

import com.hyundai.dms.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SalesAnalyticsServiceImpl implements SalesAnalyticsService {

    private final BookingRepository bookingRepository;

    public SalesAnalyticsServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<SalesAnalyticsDTO> getMonthlySales() {

        List<Object[]> results = bookingRepository.getMonthlySales();
        List<SalesAnalyticsDTO> response = new ArrayList<>();

        for (Object[] row : results) {

            Integer month = (Integer) row[0];
            Long count = (Long) row[1];

            response.add(
                    SalesAnalyticsDTO.builder()
                            .period("Month " + month)
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

            response.add(
                    SalesAnalyticsDTO.builder()
                            .period("Month " + month)
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
}