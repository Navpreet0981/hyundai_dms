package com.hyundai.dms.service.impl;

import com.hyundai.dms.dto.LeadSourceDTO;
import com.hyundai.dms.service.LeadSourceService;
import com.hyundai.dms.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeadSourceServiceImpl implements LeadSourceService {

    private final CustomerRepository customerRepository;

    public LeadSourceServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<LeadSourceDTO> getLeadSourceAnalytics() {
        List<Object[]> results = customerRepository.countLeadsBySource();
        List<LeadSourceDTO> response = new ArrayList<>();
        for (Object[] row : results) {
            String source = (String) row[0];
            Long count = (Long) row[1];
            response.add(LeadSourceDTO.builder().source(source).totalLeads(count).build());
        }
        return response;
    }
}
