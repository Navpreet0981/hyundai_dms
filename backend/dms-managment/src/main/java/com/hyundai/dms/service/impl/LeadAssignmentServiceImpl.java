package com.hyundai.dms.service.impl;

import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.repository.CustomerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import com.hyundai.dms.service.LeadAssignmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadAssignmentServiceImpl implements LeadAssignmentService {

    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;

    public LeadAssignmentServiceImpl(EmployeeRepository employeeRepository,
                                     CustomerRepository customerRepository) {
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public Employee assignEmployee(Long dealerId) {

        List<Employee> employees =
                employeeRepository.findByDealerDealerIdAndActiveTrueOrderByEmployeeIdAsc(dealerId);

        if (employees.isEmpty()) {
            throw new RuntimeException("No active employees found");
        }

        long leadCount = customerRepository.countByDealerDealerId(dealerId);

        int index = (int) (leadCount % employees.size());

        return employees.get(index);
    }
}