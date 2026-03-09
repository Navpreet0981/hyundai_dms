package com.hyundai.dms.service;

import com.hyundai.dms.dto.BookingDTO;
import com.hyundai.dms.entity.*;
import com.hyundai.dms.mapper.BookingMapper;
import com.hyundai.dms.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final CarVariantRepository variantRepository;

    public BookingService(BookingRepository bookingRepository,
                          CustomerRepository customerRepository,
                          DealerRepository dealerRepository,
                          EmployeeRepository employeeRepository,
                          CarVariantRepository variantRepository) {

        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.variantRepository = variantRepository;
    }

    public BookingDTO createBooking(BookingDTO dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Dealer dealer = dealerRepository.findById(dto.getDealerId())
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        CarVariant variant = variantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        Booking booking = Booking.builder()
                .bookingDate(dto.getBookingDate())
                .status(dto.getStatus())
                .customer(customer)
                .dealer(dealer)
                .employee(employee)
                .carVariant(variant)
                .build();

        Booking saved = bookingRepository.save(booking);

        return BookingMapper.toDTO(saved);
    }

    public List<BookingDTO> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(BookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return BookingMapper.toDTO(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}