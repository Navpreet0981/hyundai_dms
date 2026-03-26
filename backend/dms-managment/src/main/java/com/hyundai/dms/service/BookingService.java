package com.hyundai.dms.service;

import com.hyundai.dms.dto.BookingDTO;
import com.hyundai.dms.entity.*;
import com.hyundai.dms.enums.BookingStatus;
import com.hyundai.dms.mapper.BookingMapper;
import com.hyundai.dms.repository.*;
import com.hyundai.dms.service.InventoryService;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final DealerRepository dealerRepository;
    private final EmployeeRepository employeeRepository;
    private final CarVariantRepository variantRepository;
    private final InventoryService inventoryService;

    public BookingService(BookingRepository bookingRepository,
                          CustomerRepository customerRepository,
                          DealerRepository dealerRepository,
                          EmployeeRepository employeeRepository,
                          CarVariantRepository variantRepository,
                          @Lazy InventoryService inventoryService) {

        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.dealerRepository = dealerRepository;
        this.employeeRepository = employeeRepository;
        this.variantRepository = variantRepository;
        this.inventoryService = inventoryService;
    }

    public long getTotalBookings() {
        return bookingRepository.count();
    }

    @Transactional
    public BookingDTO createBooking(BookingDTO dto) {

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Dealer dealer = dealerRepository.findById(dto.getDealerId())
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        CarVariant variant = variantRepository.findById(dto.getVariantId())
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        // Inventory check — decrement returns false if out of stock
        boolean decremented = inventoryService.decrementStock(dealer.getDealerId(), variant.getVariantId());
        if (!decremented) {
            throw new RuntimeException("OUT_OF_STOCK");
        }

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

    @Transactional
    public BookingDTO updateStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus previous = booking.getStatus();
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);

        // Restore inventory when booking is cancelled (only if it wasn't already cancelled)
        if (status == BookingStatus.CANCELLED && previous != BookingStatus.CANCELLED) {
            inventoryService.incrementStock(
                    saved.getDealer().getDealerId(),
                    saved.getCarVariant().getVariantId()
            );
        }

        return BookingMapper.toDTO(saved);
    }

    public long getTotalBookingsByRole() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return bookingRepository.count();
        }

        if (role.equals("ROLE_EMPLOYEE")) {
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return bookingRepository.countByEmployeeEmployeeId(employee.getEmployeeId());
        }

        if (role.equals("ROLE_DEALER")) {
            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return bookingRepository.countByEmployeeDealerDealerId(dealer.getDealerId());
        }

        throw new RuntimeException("Unauthorized");
    }
    public Page<BookingDTO> getBookingsPaged(Pageable pageable) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        String role = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        // ✅ ADMIN → all bookings
        if (role.equals("ROLE_ADMIN")) {
            return bookingRepository.findAll(pageable)
                    .map(BookingMapper::toDTO);
        }

        // ✅ EMPLOYEE → own bookings
        if (role.equals("ROLE_EMPLOYEE")) {

            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            return bookingRepository
                    .findByEmployeeEmployeeId(employee.getEmployeeId(), pageable)
                    .map(BookingMapper::toDTO);
        }

        // ✅ DEALER → bookings under dealer
        if (role.equals("ROLE_DEALER")) {

            Dealer dealer = dealerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Dealer not found"));

            return bookingRepository
                    .findByEmployeeDealerDealerId(dealer.getDealerId(), pageable)
                    .map(BookingMapper::toDTO);
        }

        throw new RuntimeException("Unauthorized access");
    }
}