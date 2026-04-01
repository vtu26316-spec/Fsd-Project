/**
 * app.js - Main frontend JavaScript
 *
 * This file handles the HOME PAGE (index.html).
 *
 * KEY CONCEPT: fetch() API
 * fetch() is a browser built-in function that makes HTTP requests to our backend.
 * It returns a Promise — meaning it runs asynchronously (non-blocking).
 * We use async/await to write async code that reads like synchronous code.
 */

const API_BASE = 'http://localhost:8080/api';

/**
 * Fetches all events from the backend and renders them as cards.
 * Called automatically when the page loads.
 */
async function loadEvents() {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('events-grid');
    const errorDiv = document.getElementById('error');

    try {
        // fetch() sends GET http://localhost:8080/api/events
        // await pauses here until the response arrives
        const response = await fetch(`${API_BASE}/events`);

        // Check HTTP status code — 200 means OK
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        // .json() parses the response body from JSON string to a JS array
        const events = await response.json();

        // Hide spinner, show grid
        loading.style.display = 'none';
        grid.style.display = 'grid';

        // Render each event as a card
        grid.innerHTML = events.map(event => createEventCard(event)).join('');

    } catch (err) {
        // Network error or server down
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        console.error('Failed to load events:', err);
    }
}

/**
 * Creates the HTML string for a single event card.
 * @param {Object} event - event object from the API
 * @returns {string} HTML string
 */
function createEventCard(event) {
    const available = event.availableSeats;
    const percentBooked = Math.round((event.bookedSeats / event.totalCapacity) * 100);

    // Determine seat availability badge
    let badge = '';
    if (available === 0) {
        badge = '<span class="seats-badge sold-out">Sold Out</span>';
    } else if (available <= 20) {
        badge = `<span class="seats-badge limited">⚡ Only ${available} left</span>`;
    } else {
        badge = `<span class="seats-badge available">✅ ${available} seats available</span>`;
    }

    // onclick navigates to event-detail.html with the event ID in the URL query string
    return `
        <div class="event-card" onclick="window.location.href='event-detail.html?id=${event.id}'">
            <h3>${event.name}</h3>
            <p class="event-meta">📅 ${event.date}</p>
            <p class="event-meta">📍 ${event.venue}</p>
            <p class="event-price">R ${event.price.toFixed(2)} per ticket</p>
            ${badge}
        </div>
    `;
}

// Run loadEvents() as soon as the page DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth(); // redirect to login if not logged in
    document.getElementById('nav-username').textContent = `👤 ${user.username} (${user.role})`;
    loadEvents();
});
