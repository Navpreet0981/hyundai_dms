package com.hyundai.dms.service;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.enums.EmployeeStatus;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.EmployeeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DealerRepository dealerRepository;

    public List<EmployeeDTO> getEmployeesByDealer(Long dealerId) {

        return employeeRepository
                .findByDealer_DealerIdAndStatus(dealerId, EmployeeStatus.ACTIVE)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public EmployeeService(EmployeeRepository employeeRepository,
                           DealerRepository dealerRepository) {
        this.employeeRepository = employeeRepository;
        this.dealerRepository = dealerRepository;
    }


    public EmployeeDTO getLoggedInEmployee(){

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Employee employee = employeeRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        EmployeeDTO dto = new EmployeeDTO();

        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setRole(employee.getRole());

        if(employee.getDealer()!=null){
            dto.setDealerId(employee.getDealer().getDealerId());
            dto.setDealerName(employee.getDealer().getDealerName());
            dto.setDealerCity(employee.getDealer().getCity());
            dto.setDealerState(employee.getDealer().getState());
        }

        return dto;
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
        employee.setStatus(EmployeeStatus.ACTIVE);
        return mapToDTO(saved);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDTO mapToDTO(Employee employee){

        EmployeeDTO dto = new EmployeeDTO();

        dto.setEmployeeId(employee.getEmployeeId());
        dto.setName(employee.getName());
        dto.setEmail(employee.getEmail());
        dto.setPhone(employee.getPhone());
        dto.setRole(employee.getRole());
        dto.setStatus(employee.getStatus() != null ? employee.getStatus().name() : null);
        if(employee.getDealer()!=null){

            dto.setDealerId(employee.getDealer().getDealerId());
            dto.setDealerName(employee.getDealer().getDealerName());
            dto.setDealerCity(employee.getDealer().getCity());
            dto.setDealerState(employee.getDealer().getState());

        }

        return dto;
    }

    public void deleteEmployee(Long employeeId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // 🔒 SECURITY CHECK
        if (employee.getDealer() == null ||
                !employee.getDealer().getDealerId().equals(dealer.getDealerId())) {

            throw new RuntimeException("Unauthorized");
        }

        // ✅ SOFT DELETE
        employee.setStatus(EmployeeStatus.INACTIVE);

        employeeRepository.save(employee);
    }
}