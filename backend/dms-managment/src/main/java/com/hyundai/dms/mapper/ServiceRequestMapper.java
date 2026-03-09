package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.ServiceRequestDTO;
import com.hyundai.dms.entity.ServiceRequest;

public class ServiceRequestMapper {

    public static ServiceRequestDTO toDTO(ServiceRequest request) {

        return ServiceRequestDTO.builder()
                .serviceRequestId(request.getServiceRequestId())
                .serviceDate(request.getServiceDate())
                .issueDescription(request.getIssueDescription())
                .status(request.getStatus())
                .customerId(request.getCustomer().getCustomerId())
                .dealerId(request.getDealer().getDealerId())
                .variantId(request.getCarVariant().getVariantId())
                .build();
    }
}