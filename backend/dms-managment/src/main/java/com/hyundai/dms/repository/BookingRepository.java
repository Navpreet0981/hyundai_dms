package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByDealerDealerId(Long dealerId);

    List<Booking> findByEmployeeEmployeeId(Long employeeId);

    List<Booking> findByCustomerCustomerId(Long customerId);

    long countByDealerDealerId(Long dealerId);
    @Query("SELECT MONTH(b.bookingDate), COUNT(b) FROM Booking b GROUP BY MONTH(b.bookingDate)")
    List<Object[]> getMonthlySales();

    @Query("SELECT YEAR(b.bookingDate), COUNT(b) FROM Booking b GROUP BY YEAR(b.bookingDate)")
    List<Object[]> getYearlySales();

    @Query("SELECT MONTH(b.bookingDate), COUNT(b) FROM Booking b WHERE b.dealer.dealerId = :dealerId GROUP BY MONTH(b.bookingDate)")
    List<Object[]> getMonthlySalesByDealer(Long dealerId);

    @Query("SELECT YEAR(b.bookingDate), COUNT(b) FROM Booking b WHERE b.dealer.dealerId = :dealerId GROUP BY YEAR(b.bookingDate)")
    List<Object[]> getYearlySalesByDealer(Long dealerId);
}