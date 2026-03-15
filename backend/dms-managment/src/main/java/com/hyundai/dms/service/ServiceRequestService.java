package com.hyundai.dms.service;

import com.hyundai.dms.dto.ServiceRequestDTO;
import com.hyundai.dms.entity.*;
import com.hyundai.dms.mapper.ServiceRequestMapper;
import com.hyundai.dms.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final CarVariantRepository variantRepository;

    public ServiceRequestService(ServiceRequestRepository requestRepository,
                                 CustomerRepository customerRepository,
                                 DealerRepository dealerRepository,
                                 CarVariantRepository variantRepository) {

        this.requestRepository = requestRepository;
        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.variantRepository = variantRepository;
    }

    public ServiceRequestDTO createRequest(ServiceRequestDTO dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Dealer dealer = dealerRepository.findById(dto.getDealerId())
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        CarVariant variant = variantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        ServiceRequest request = ServiceRequest.builder()
                .serviceDate(dto.getServiceDate())
                .issueDescription(dto.getIssueDescription())
                .status(dto.getStatus())
                .customer(customer)
                .dealer(dealer)
                .carVariant(variant)
                .build();

        ServiceRequest saved = requestRepository.save(request);

        return ServiceRequestMapper.toDTO(saved);
    }

    public List<ServiceRequestDTO> getAllRequests() {

        return requestRepository.findAll()
                .stream()
                .map(ServiceRequestMapper::toDTO)
                .collect(Collectors.toList());
    }

    public long getTotalServiceRequests() {
        return requestRepository.count();
    }

    public ServiceRequestDTO getRequestById(Long id) {

        ServiceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        return ServiceRequestMapper.toDTO(request);
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}