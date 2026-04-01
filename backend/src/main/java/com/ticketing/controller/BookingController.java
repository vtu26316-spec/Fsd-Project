package com.ticketing.controller;

import com.ticketing.model.Booking;
import com.ticketing.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * BOOKING CONTROLLER
 *
 * REST Endpoints:
 *   POST /api/bookings              → create a new booking
 *   GET  /api/bookings              → get all bookings
 *   GET  /api/bookings/event/{id}   → get bookings for a specific event
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * POST /api/bookings
     * Accepts JSON body: { "eventId": 1, "customerName": "...", "customerEmail": "...", "tickets": 2 }
     *
     * @RequestBody Map<String, Object> - reads raw JSON as a Map for flexibility
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> body) {
        try {
            Long eventId = Long.valueOf(body.get("eventId").toString());
            String customerName = body.get("customerName").toString();
            String customerEmail = body.get("customerEmail").toString();
            int tickets = Integer.parseInt(body.get("tickets").toString());

            Booking booking = bookingService.createBooking(eventId, customerName, customerEmail, tickets);
            return ResponseEntity.ok(booking);

        } catch (RuntimeException e) {
            // Return 400 Bad Request with the error message
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/bookings
     * Returns all bookings in the system
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * GET /api/bookings/event/{eventId}
     * Returns all bookings for a specific event
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Booking>> getBookingsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(bookingService.getBookingsByEvent(eventId));
    }
}
