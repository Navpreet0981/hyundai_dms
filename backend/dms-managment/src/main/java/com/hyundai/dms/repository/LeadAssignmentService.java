package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Employee;

public interface LeadAssignmentService {

    Employee assignEmployee(Long dealerId);

}