# EventHub - Full-Stack Java Ticketing Platform

## How to Run

### 1. Start the Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
API runs at: http://localhost:8080

### 2. Open the Frontend
Open `frontend/index.html` directly in your browser.
(Or serve it with Live Server in VS Code)

---

## PRC Walkthrough — What to Explain for Each Mark

### ✅ UI Design & Responsiveness
- Dark theme using CSS custom colors and gradients
- CSS Grid with `auto-fill` makes the event cards responsive automatically
- `@media (max-width: 600px)` collapses layout for mobile
- Hover animations on cards using CSS `transition` and `transform`
- Loading spinner using CSS `@keyframes` animation

### ✅ Frontend Functionality
- `index.html` → event listing with seat availability badges
- `event-detail.html` → dynamic routing via `?id=X` URL query param
- Ticket count input updates total price in real-time using `addEventListener('input')`
- Capacity progress bar fills based on `bookedSeats / totalCapacity`
- Form validation with `required` attributes + JS error handling

### ✅ State Management
- `currentEvent` variable holds loaded event state on the detail page
- DOM is updated reactively when state changes (price recalculates, seats update after booking)
- Loading/error/success states managed by showing/hiding elements

### ✅ Backend API (Spring Boot REST)
- `EventController.java` → GET /api/events, GET /api/events/{id}, POST /api/events
- `BookingController.java` → POST /api/bookings, GET /api/bookings
- `@RestController` returns JSON automatically
- `@CrossOrigin` enables CORS so the frontend can call the API
- `ResponseEntity` controls HTTP status codes (200, 400, 404)

### ✅ Frontend–Backend Integration
- `fetch()` in `app.js` calls `GET /api/events` on page load
- `fetch()` with `method: POST` and `JSON.stringify()` sends booking data
- Loading spinner shown while awaiting response
- Error message shown if backend is unreachable

### ✅ Database Connectivity
- Spring Data JPA + H2 in-memory SQL database
- `Event.java` and `Booking.java` are `@Entity` classes — JPA creates tables automatically
- `EventRepository` and `BookingRepository` extend `JpaRepository` — free CRUD methods
- `data.sql` seeds 5 events on startup
- `@ManyToOne` relationship between Booking and Event (foreign key)
- H2 console at http://localhost:8080/h2-console to inspect data live

---

## Architecture Diagram

```
Browser (HTML/CSS/JS)
        |
        | fetch() HTTP requests
        ↓
Spring Boot REST API (port 8080)
  ├── Controller Layer  → handles HTTP routes
  ├── Service Layer     → business logic
  ├── Repository Layer  → database queries (JPA)
        |
        ↓
   H2 SQL Database (in-memory)
```

## Project Structure

```
backend/
  src/main/java/com/ticketing/
    TicketingApplication.java     ← entry point
    model/
      Event.java                  ← database entity
      Booking.java                ← database entity
    repository/
      EventRepository.java        ← data access
      BookingRepository.java      ← data access
    service/
      EventService.java           ← business logic
      BookingService.java         ← business logic
    controller/
      EventController.java        ← REST API routes
      BookingController.java      ← REST API routes
  src/main/resources/
    application.properties        ← config
    data.sql                      ← seed data

frontend/
  index.html                      ← event listing
  event-detail.html               ← event detail + booking form
  bookings.html                   ← all bookings
  style.css                       ← dark theme styles
  app.js                          ← home page logic
  event-detail.js                 ← detail + booking logic
  bookings.js                     ← bookings page logic
```
