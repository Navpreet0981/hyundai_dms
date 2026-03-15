package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.TestDriveDTO;
import com.hyundai.dms.entity.TestDrive;

public class TestDriveMapper {

    public static TestDriveDTO toDTO(TestDrive td){

        return TestDriveDTO.builder()
                .testDriveId(td.getTestDriveId())
                .testDriveDate(td.getTestDriveDate())
                .status(td.getStatus().name())

                .customerId(td.getCustomer().getCustomerId())
                .dealerId(td.getDealer().getDealerId())
                .employeeId(td.getEmployee().getEmployeeId())
                .variantId(td.getCarVariant().getVariantId())

                .customerName(td.getCustomer().getName())
                .variantName(td.getCarVariant().getVariantName())
                .dealerName(td.getDealer().getDealerName())
                .employeeName(td.getEmployee().getName())

                .build();
    }

}