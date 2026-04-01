package com.ticketing.service;

import com.ticketing.model.Booking;
import com.ticketing.model.Event;
import com.ticketing.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * BOOKING SERVICE - Business logic for creating and retrieving bookings
 */
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventService eventService; // Service can call another Service

    /**
     * Create a new booking:
     * 1. Validate the event exists and has capacity
     * 2. Calculate total price
     * 3. Generate a unique booking reference
     * 4. Update the event's booked seats
     * 5. Save the booking to the database
     */
    public Booking createBooking(Long eventId, String customerName,
                                  String customerEmail, int tickets) {

        // Step 1: Get the event (throws exception if not found)
        Event event = eventService.getEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Step 2: Calculate total price
        double totalPrice = event.getPrice() * tickets;

        // Step 3: Generate unique booking reference — timestamp + UUID ensures no collision
        String reference = "BK-" + System.currentTimeMillis() % 100000
                + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        // Step 4: Update event capacity (business logic in EventService)
        eventService.updateBookedSeats(eventId, tickets);

        // Step 5: Save and return the booking
        Booking booking = new Booking(customerName, customerEmail, tickets,
                                       totalPrice, reference, event);
        return bookingRepository.save(booking);
    }

    /**
     * Get all bookings for a specific event
     */
    public List<Booking> getBookingsByEvent(Long eventId) {
        return bookingRepository.findByEventId(eventId);
    }

    /**
     * Get all bookings in the system
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
