package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.CustomerDTO;
import com.hyundai.dms.entity.Customer;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;

public class CustomerMapper {

    public static CustomerDTO toDTO(Customer customer) {

        return CustomerDTO.builder()
                .customerId(customer.getCustomerId())
                .name(customer.getName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .city(customer.getCity())
                .leadSource(customer.getLeadSource())
                .interestedModel(customer.getInterestedModel())
                .leadStatus(customer.getLeadStatus())
                .createdDate(customer.getCreatedDate())
                .dealerId(customer.getDealer() != null ? customer.getDealer().getDealerId() : null)
                .employeeId(customer.getEmployee() != null ? customer.getEmployee().getEmployeeId() : null)
                .build();
    }

    public static Customer toEntity(CustomerDTO dto) {

        Dealer dealer = null;
        if (dto.getDealerId() != null) {
            dealer = new Dealer();
            dealer.setDealerId(dto.getDealerId());
        }

        Employee employee = null;
        if (dto.getEmployeeId() != null) {
            employee = new Employee();
            employee.setEmployeeId(dto.getEmployeeId());
        }

        return Customer.builder()
                .customerId(dto.getCustomerId())
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .city(dto.getCity())
                .leadSource(dto.getLeadSource())
                .interestedModel(dto.getInterestedModel())
                .leadStatus(dto.getLeadStatus())
                .createdDate(dto.getCreatedDate())
                .dealer(dealer)
                .employee(employee)
                .build();
    }
}