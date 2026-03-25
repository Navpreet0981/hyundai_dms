package com.hyundai.dms.controller;

import com.hyundai.dms.dto.EmployeeDTO;
import com.hyundai.dms.security.util.CurrentUserUtil;
import com.hyundai.dms.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dealer/employees")
public class DealerEmployeeController {

    private final EmployeeService employeeService;
    private final CurrentUserUtil currentUserUtil;

    public DealerEmployeeController(EmployeeService employeeService,
                                    CurrentUserUtil currentUserUtil) {
        this.employeeService = employeeService;
        this.currentUserUtil = currentUserUtil;
    }

    @GetMapping
    public List<EmployeeDTO> getDealerEmployees() {

        Long dealerId = currentUserUtil.getLoggedInDealerId();

        return employeeService.getEmployeesByDealer(dealerId);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable("id") Long id) {
        employeeService.deleteEmployee(id);
    }
}