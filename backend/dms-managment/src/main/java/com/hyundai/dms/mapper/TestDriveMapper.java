package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.TestDriveDTO;
import com.hyundai.dms.entity.TestDrive;

public class TestDriveMapper {

    public static TestDriveDTO toDTO(TestDrive testDrive) {

        return TestDriveDTO.builder()
                .testDriveId(testDrive.getTestDriveId())
                .testDriveDate(testDrive.getTestDriveDate())
                .status(testDrive.getStatus())
                .customerId(testDrive.getCustomer().getCustomerId())
                .dealerId(testDrive.getDealer().getDealerId())
                .employeeId(testDrive.getEmployee().getEmployeeId())
                .variantId(testDrive.getCarVariant().getVariantId())
                .build();
    }
}