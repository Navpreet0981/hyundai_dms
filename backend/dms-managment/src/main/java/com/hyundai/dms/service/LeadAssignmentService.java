package com.hyundai.dms.service;

import com.hyundai.dms.entity.Employee;

public interface LeadAssignmentService {

    Employee assignEmployee(Long dealerId);

}