/**
 * bookings.js - All Bookings Page
 * Fetches and displays all bookings from the backend
 */

const API_BASE = 'http://localhost:8080/api';

async function loadBookings() {
    const loading = document.getElementById('loading');
    const list = document.getElementById('bookings-list');
    const empty = document.getElementById('no-bookings');

    try {
        // GET /api/bookings — fetch all bookings
        const response = await fetch(`${API_BASE}/bookings`);
        const bookings = await response.json();

        loading.style.display = 'none';

        if (bookings.length === 0) {
            empty.style.display = 'block';
            return;
        }

        list.style.display = 'block';
        list.innerHTML = bookings.map(b => `
            <div class="booking-item">
                <div>
                    <div class="booking-ref">${b.bookingReference}</div>
                    <div class="booking-info">${b.customerName} · ${b.customerEmail}</div>
                    <div class="booking-info">🎟️ ${b.tickets} ticket(s) · ${b.event.name}</div>
                </div>
                <div class="booking-price">R ${b.totalPrice.toFixed(2)}</div>
            </div>
        `).join('');

    } catch (err) {
        loading.innerHTML = '<p class="error-msg">⚠️ Could not load bookings. Is the backend running?</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth();
    document.getElementById('nav-username').textContent = `👤 ${user.username} (${user.role})`;
    loadBookings();
});
