package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.BookingDTO;
import com.hyundai.dms.entity.Booking;

public class BookingMapper {

    public static BookingDTO toDTO(Booking booking) {

        return BookingDTO.builder()
                .bookingId(booking.getBookingId())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus())

                .customerId(booking.getCustomer().getCustomerId())
                .dealerId(booking.getDealer().getDealerId())
                .employeeId(booking.getEmployee().getEmployeeId())
                .variantId(booking.getCarVariant().getVariantId())

                .customerName(booking.getCustomer().getName())
                .variantName(booking.getCarVariant().getVariantName())
                .dealerName(booking.getDealer().getDealerName())
                .employeeName(booking.getEmployee().getName())

                .build();
    }
}