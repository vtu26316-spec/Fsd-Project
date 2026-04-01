package com.ticketing.controller;

import com.ticketing.model.Event;
import com.ticketing.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER LAYER (REST API)
 *
 * The Controller is the entry point for all HTTP requests.
 * It maps URLs to Java methods and returns JSON responses.
 *
 * @RestController - combines @Controller + @ResponseBody
 *                   every method returns JSON automatically
 * @RequestMapping - base URL prefix for all routes in this controller
 * @CrossOrigin    - allows the frontend (different port) to call this API (CORS)
 *
 * REST Endpoints exposed:
 *   GET  /api/events        → get all events
 *   GET  /api/events/{id}   → get one event
 *   POST /api/events        → create a new event
 */
@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*") // Allow all origins for development
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * GET /api/events
     * Returns a list of all events as JSON
     * HTTP 200 OK
     */
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events); // 200 OK + JSON body
    }

    /**
     * GET /api/events/{id}
     * Returns a single event by ID
     * HTTP 200 OK if found, 404 Not Found if not
     *
     * @PathVariable - extracts {id} from the URL
     */
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)                    // found → 200 OK
                .orElse(ResponseEntity.notFound().build()); // not found → 404
    }

    /**
     * POST /api/events
     * Creates a new event
     * @RequestBody - Spring reads the JSON body and converts it to an Event object
     * HTTP 200 OK with the saved event (including generated ID)
     */
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event saved = eventService.createEvent(event);
        return ResponseEntity.ok(saved);
    }
}
