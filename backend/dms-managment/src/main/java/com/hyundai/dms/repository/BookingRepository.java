package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByDealerDealerId(Long dealerId);

    List<Booking> findByEmployeeEmployeeId(Long employeeId);

    List<Booking> findByCustomerCustomerId(Long customerId);

}