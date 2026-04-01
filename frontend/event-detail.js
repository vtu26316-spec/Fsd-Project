/**
 * event-detail.js - Event Detail & Booking Page
 *
 * KEY CONCEPTS demonstrated here:
 * 1. Reading URL query parameters (URLSearchParams)
 * 2. Dynamic DOM manipulation
 * 3. Real-time price calculation on input change
 * 4. POST request with JSON body using fetch()
 * 5. Form validation and user feedback
 */

const API_BASE = 'http://localhost:8080/api';

let currentEvent = null; // Store the loaded event globally on this page

/**
 * Reads the ?id=X from the URL and loads that event from the API
 */
async function loadEventDetail() {
    // URLSearchParams parses the query string: ?id=3 → params.get('id') = "3"
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    if (!eventId) {
        window.location.href = 'index.html'; // No ID? Go back home
        return;
    }

    try {
        // GET /api/events/{id}
        const response = await fetch(`${API_BASE}/events/${eventId}`);

        if (!response.ok) throw new Error('Event not found');

        currentEvent = await response.json();
        renderEventDetail(currentEvent);

    } catch (err) {
        document.getElementById('loading').innerHTML =
            '<p class="error-msg">⚠️ Could not load event. Is the backend running?</p>';
    }
}

/**
 * Populates the page with event data
 */
function renderEventDetail(event) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('event-detail').style.display = 'block';

    // Set page title
    document.title = `${event.name} - EventHub`;

    // Fill in the event details
    document.getElementById('event-name').textContent = event.name;
    document.getElementById('event-date').textContent = `📅 ${event.date}`;
    document.getElementById('event-venue').textContent = `📍 ${event.venue}`;
    document.getElementById('event-price').textContent = `💰 R ${event.price.toFixed(2)} per ticket`;
    document.getElementById('event-description').textContent = event.description;

    // Capacity bar
    const percentBooked = (event.bookedSeats / event.totalCapacity) * 100;
    document.getElementById('capacity-fill').style.width = `${percentBooked}%`;
    document.getElementById('capacity-text').textContent =
        `${event.availableSeats} / ${event.totalCapacity} available`;

    // Disable booking if sold out
    if (event.availableSeats === 0) {
        document.getElementById('book-btn').disabled = true;
        document.getElementById('book-btn').textContent = 'Sold Out';
    }

    // Set max tickets to available seats
    document.getElementById('tickets').max = event.availableSeats;

    // Calculate price on ticket count change
    updateTotalPrice();
}

/**
 * Updates the displayed total price when ticket count changes
 */
function updateTotalPrice() {
    const ticketsInput = document.getElementById('tickets');
    const totalEl = document.getElementById('total-price');

    if (currentEvent && ticketsInput) {
        const count = parseInt(ticketsInput.value) || 0;
        const total = count * currentEvent.price;
        totalEl.textContent = `R ${total.toFixed(2)}`;
    }
}

/**
 * Handles the booking form submission
 * Sends a POST request to /api/bookings with JSON body
 */
async function handleBooking(e) {
    e.preventDefault(); // Prevent default HTML form submission (page reload)

    const btn = document.getElementById('book-btn');
    const successDiv = document.getElementById('booking-success');
    const errorDiv = document.getElementById('booking-error');

    // Hide previous messages
    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    // Collect form values
    const bookingData = {
        eventId: currentEvent.id,
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        tickets: parseInt(document.getElementById('tickets').value)
    };

    btn.disabled = true;
    btn.textContent = 'Processing...';

    try {
        /**
         * POST /api/bookings
         * fetch() with method: 'POST' and a JSON body
         * Content-Type header tells the server we're sending JSON
         * JSON.stringify() converts the JS object to a JSON string
         */
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (!response.ok) {
            // Server returned 400 Bad Request with an error message
            throw new Error(result.error || 'Booking failed');
        }

        // Success! Show confirmation with booking reference
        successDiv.style.display = 'block';
        successDiv.innerHTML = `
            ✅ Booking confirmed!<br>
            Reference: <strong>${result.bookingReference}</strong><br>
            ${result.tickets} ticket(s) for ${result.event.name}<br>
            Total: R ${result.totalPrice.toFixed(2)}
        `;

        // Reset form
        document.getElementById('booking-form').reset();

        // Reload event to update available seats
        await loadEventDetail();

    } catch (err) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `⚠️ ${err.message}`;
        btn.disabled = false;
        btn.textContent = 'Confirm Booking';
    }
}

// Wire up event listeners once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth(); // redirect to login if not logged in
    document.getElementById('nav-username').textContent = `👤 ${user.username} (${user.role})`;

    loadEventDetail();

    // Listen for ticket count changes to update price in real-time
    document.getElementById('tickets').addEventListener('input', updateTotalPrice);

    // Listen for form submission
    document.getElementById('booking-form').addEventListener('submit', handleBooking);
});
