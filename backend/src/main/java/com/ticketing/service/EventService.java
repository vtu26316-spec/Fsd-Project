package com.ticketing.service;

import com.ticketing.model.Event;
import com.ticketing.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * SERVICE LAYER
 *
 * The Service layer sits between the Controller and Repository.
 * It contains the BUSINESS LOGIC of the application.
 *
 * Why separate from Controller?
 *   - Controller handles HTTP (request/response)
 *   - Service handles business rules (e.g. "can we book this ticket?")
 *   - Repository handles database queries
 *
 * This separation is called the "Layered Architecture" pattern.
 *
 * @Service - marks this as a Spring-managed service component
 * @Autowired - Spring automatically injects the EventRepository dependency (Dependency Injection)
 */
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    /**
     * Get all events from the database
     */
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    /**
     * Get a single event by its ID
     * Returns Optional<Event> — it might not exist, so we handle that safely
     */
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    /**
     * Create a new event and save it to the database
     */
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    /**
     * Update booked seats after a booking is made
     * This is business logic — it belongs in the Service layer
     */
    public Event updateBookedSeats(Long eventId, int additionalSeats) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        // Business rule: cannot book more seats than available
        if (additionalSeats > event.getAvailableSeats()) {
            throw new RuntimeException("Not enough seats available. Only " +
                    event.getAvailableSeats() + " seats left.");
        }

        event.setBookedSeats(event.getBookedSeats() + additionalSeats);
        return eventRepository.save(event);
    }
}
