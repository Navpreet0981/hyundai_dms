package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.hyundai.dms.enums.TestDriveStatus;
import java.time.LocalDate;

@Entity
@Table(name = "test_drives")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TestDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testDriveId;

    private LocalDate testDriveDate;

    @Enumerated(EnumType.STRING)
    private TestDriveStatus status;

    // Customer requesting test drive
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Dealer providing the test drive
    @ManyToOne
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    // Variant to test drive
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private CarVariant carVariant;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}