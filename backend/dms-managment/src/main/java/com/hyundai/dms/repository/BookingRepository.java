package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Booking;
import com.hyundai.dms.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByCustomerCustomerId(Long customerId);
    Long countByDealer(Dealer dealer);

    long countByEmployeeEmployeeId(Long employeeId);

    long countByEmployeeDealerDealerId(Long dealerId);

    // EMPLOYEE → own bookings
    Page<Booking> findByEmployeeEmployeeId(Long employeeId, Pageable pageable);

    // DEALER → bookings under dealer
    Page<Booking> findByEmployeeDealerDealerId(Long dealerId, Pageable pageable);

    long countByDealerDealerId(Long dealerId);
    @Query("SELECT MONTH(b.bookingDate), COUNT(b) FROM Booking b GROUP BY MONTH(b.bookingDate)")
    List<Object[]> getMonthlySales();

    @Query("SELECT YEAR(b.bookingDate), COUNT(b) FROM Booking b GROUP BY YEAR(b.bookingDate)")
    List<Object[]> getYearlySales();

    @Query("SELECT MONTH(b.bookingDate), COUNT(b) FROM Booking b WHERE b.dealer.dealerId = :dealerId GROUP BY MONTH(b.bookingDate)")
    List<Object[]> getMonthlySalesByDealer(@Param("dealerId") Long dealerId);

    @Query("SELECT YEAR(b.bookingDate), COUNT(b) FROM Booking b WHERE b.dealer.dealerId = :dealerId GROUP BY YEAR(b.bookingDate)")
    List<Object[]> getYearlySalesByDealer(@Param("dealerId") Long dealerId);

    @Query("SELECT d.dealerName, COUNT(b) FROM Booking b JOIN b.dealer d GROUP BY d.dealerName")
    List<Object[]> getSalesPerDealer();


    @Query(" SELECT COALESCE(SUM(v.price),0) FROM Booking b  JOIN b.carVariant v")
    Double getTotalRevenue();

    @Query("SELECT COUNT(b) FROM Booking b")
    Long getTotalBookings();

    @Query("SELECT COALESCE(SUM(v.price),0) FROM Booking b JOIN b.carVariant v WHERE b.dealer.dealerId = :dealerId")
    Double getTotalRevenueByDealer(@Param("dealerId") Long dealerId);

    // Single aggregated query: returns [employeeId, leadCount, testDriveCount, bookingCount] per employee for a dealer
    //  N+1: replaces 3 per-employee count queries with one JOIN query
    @Query("""
        SELECT e.employeeId, e.user.name,
               COUNT(DISTINCT c.customerId),
               COUNT(DISTINCT t.testDriveId),
               COUNT(DISTINCT b.bookingId)
        FROM Employee e
        LEFT JOIN Customer c ON c.employee.employeeId = e.employeeId
        LEFT JOIN TestDrive t ON t.employee.employeeId = e.employeeId
        LEFT JOIN Booking b   ON b.employee.employeeId = e.employeeId
        WHERE e.dealer.dealerId = :dealerId AND e.user.active = true
        GROUP BY e.employeeId, e.user.name
        ORDER BY e.employeeId ASC
    """)
    List<Object[]> getEmployeePerformanceByDealer(@Param("dealerId") Long dealerId);

    @Modifying
    @Query("UPDATE Booking b SET b.dealer.dealerId = :newDealerId WHERE b.dealer.dealerId = :oldDealerId")
    void reassignDealer(@Param("oldDealerId") Long oldDealerId, @Param("newDealerId") Long newDealerId);

    @Modifying
    @Query("UPDATE Booking b SET b.employee.employeeId = :newEmployeeId WHERE b.employee.employeeId = :oldEmployeeId")
    void reassignEmployee(@Param("oldEmployeeId") Long oldEmployeeId, @Param("newEmployeeId") Long newEmployeeId);
}