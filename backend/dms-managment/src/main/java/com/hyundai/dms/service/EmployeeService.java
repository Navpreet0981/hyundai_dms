package com.hyundai.dms.service;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DealerRepository dealerRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DealerRepository dealerRepository) {
        this.employeeRepository = employeeRepository;
        this.dealerRepository = dealerRepository;
    }

    public EmployeeDTO createEmployee(EmployeeDTO dto) {

        Dealer dealer = dealerRepository.findById(dto.getDealerId())
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setRole(dto.getRole());
        employee.setDealer(dealer);
        employee.setActive(true);

        Employee saved = employeeRepository.save(employee);

        return mapToDTO(saved);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDTO mapToDTO(Employee employee) {

        EmployeeDTO dto = new EmployeeDTO();

        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setRole(employee.getRole());
        dto.setDealerId(employee.getDealer().getDealerId());

        return dto;
    }
}