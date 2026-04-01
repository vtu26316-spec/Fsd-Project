const API = '/api';

async function loadBookings() {
    try {
        const res      = await fetch(`${API}/bookings`);
        const bookings = await res.json();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('booking-count').textContent = `${bookings.length} total`;

        if (bookings.length === 0) { document.getElementById('empty').style.display='block'; return; }

        document.getElementById('bookings-list').innerHTML = bookings.map(b => `
            <div style="background:#12121f;border:1px solid #252540;border-radius:14px;padding:1.2rem 1.5rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;">
                <div>
                    <div style="font-family:monospace;color:#7c6fff;font-size:.85rem;margin-bottom:.3rem;">${b.bookingReference}</div>
                    <div style="color:#fff;font-weight:600;">${b.event.name}</div>
                    <div style="color:#64748b;font-size:.85rem;margin-top:.2rem;">${b.customerName} · ${b.customerEmail}</div>
                    <div style="color:#64748b;font-size:.82rem;">🎟️ ${b.tickets} ticket(s) · 📅 ${b.event.date}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:1.3rem;font-weight:700;color:#22c55e;">R ${b.totalPrice.toFixed(2)}</div>
                    <div style="font-size:.75rem;color:#64748b;">Total paid</div>
                </div>
            </div>
        `).join('');

    } catch {
        document.getElementById('loading').innerHTML = '<p class="error-msg">⚠️ Could not load bookings.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth();
    document.getElementById('nav-avatar').textContent   = user.username[0].toUpperCase();
    document.getElementById('nav-username').textContent = user.username;
    loadBookings();
});
