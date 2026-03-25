package com.hyundai.dms.controller;

import com.hyundai.dms.dto.BookingDTO;
import com.hyundai.dms.enums.BookingStatus;
import com.hyundai.dms.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingDTO createBooking(@RequestBody BookingDTO dto) {
        return bookingService.createBooking(dto);
    }

    @GetMapping
    public List<BookingDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public BookingDTO getBooking(@PathVariable("id") Long id) {
        return bookingService.getBookingById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable("id") Long id) {
        bookingService.deleteBooking(id);
    }

    // Fix #6: Returns BookingDTO instead of raw Booking entity
    @PutMapping("/{id}/status")
    public BookingDTO updateStatus(
            @PathVariable("id") Long id,
            @RequestParam(name = "status") BookingStatus status
    ) {
        return bookingService.updateStatus(id, status);
    }

    @GetMapping("/paged")
    public Page<BookingDTO> getBookingsPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingService.getBookingsPaged(pageable);
    }
}
