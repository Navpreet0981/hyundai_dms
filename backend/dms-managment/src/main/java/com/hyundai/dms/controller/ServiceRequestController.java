package com.hyundai.dms.controller;

import com.hyundai.dms.dto.ServiceRequestDTO;
import com.hyundai.dms.service.ServiceRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestController(ServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @PostMapping
    public ServiceRequestDTO createRequest(@RequestBody ServiceRequestDTO dto) {
        return serviceRequestService.createRequest(dto);
    }

    @GetMapping
    public List<ServiceRequestDTO> getAllRequests() {
        return serviceRequestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public ServiceRequestDTO getRequest(@PathVariable Long id) {
        return serviceRequestService.getRequestById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        serviceRequestService.deleteRequest(id);
    }
}