package com.hyundai.dms.controller;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.service.EmployeeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public EmployeeDTO createEmployee(@RequestBody EmployeeDTO dto) {
        return employeeService.createEmployee(dto);
    }

    @GetMapping
    public List<EmployeeDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // GET logged-in employee profile
    @GetMapping("/me")
    public EmployeeDTO getCurrentEmployee(){
        return employeeService.getLoggedInEmployee();
    }

    @GetMapping("/paged")
    public Page<EmployeeDTO> getEmployeesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "employeeId,desc") String[] sort
    ) {

        Sort sorting = Sort.by(
                sort[1].equalsIgnoreCase("asc") ?
                        Sort.Direction.ASC : Sort.Direction.DESC,
                sort[0]
        );

        Pageable pageable = PageRequest.of(page, size, sorting);

        return employeeService.getEmployeesPaged(search, pageable);
    }
}