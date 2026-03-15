package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.ServiceRequestDTO;
import com.hyundai.dms.entity.ServiceRequest;

public class ServiceRequestMapper {

    public static ServiceRequestDTO toDTO(ServiceRequest sr){

        return ServiceRequestDTO.builder()
                .serviceRequestId(sr.getServiceRequestId())
                .serviceDate(sr.getServiceDate())
                .issueDescription(sr.getIssueDescription())
                .status(sr.getStatus())

                .customerId(sr.getCustomer().getCustomerId())
                .dealerId(sr.getDealer().getDealerId())
                .variantId(sr.getCarVariant().getVariantId())

                .customerName(sr.getCustomer().getName())
                .variantName(sr.getCarVariant().getVariantName())
                .dealerName(sr.getDealer().getDealerName())

                .build();
    }
}