package com.hyundai.dms.dto;

import com.hyundai.dms.enums.BookingStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {

    private Long bookingId;

    private LocalDate bookingDate;

    private BookingStatus status;

    private Long customerId;
    private Long dealerId;
    private Long employeeId;
    private Long variantId;

    private String customerName;
    private String variantName;
    private String dealerName;
    private String employeeName;
}