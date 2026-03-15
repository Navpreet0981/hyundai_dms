package com.hyundai.dms.controller;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

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
}