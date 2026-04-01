const API_BASE = '/api';
let currentEvent = null;
let currentStep  = 1;
let selectedSeatType = null;

// Seat type options with pricing multipliers
const SEAT_TYPES = [
    { id: 'economy',  label: 'Economy',  icon: '🪑', desc: 'Standard seating, great view',        multiplier: 1.0,  color: '#2a3a5a' },
    { id: 'standard', label: 'Standard', icon: '💺', desc: 'Comfortable seats with extra legroom', multiplier: 1.5,  color: '#2a2a5a' },
    { id: 'vip',      label: 'VIP',      icon: '⭐', desc: 'Premium front-row VIP experience',     multiplier: 2.5,  color: '#3a2a5a' },
];

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const user = requireAuth();
    document.getElementById('nav-username').textContent = `👤 ${user.username} (${user.role})`;

    // Auto-fill name from session
    if (user.fullname) document.getElementById('s1-name').value = user.fullname;

    // Load event from URL ?id=
    const params  = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    if (!eventId) { window.location.href = 'index.html'; return; }

    try {
        const res = await fetch(`${API_BASE}/events/${eventId}`);
        if (!res.ok) throw new Error();
        currentEvent = await res.json();
        renderEventBanner();
        renderSeatTypes();
        // Set ticket max
        document.getElementById('s1-tickets').max = Math.min(currentEvent.availableSeats, 10);
    } catch {
        document.getElementById('event-banner').innerHTML =
            '<p class="error-msg">⚠️ Could not load event.</p>';
    }

    // Card number formatting
    document.getElementById('p-card').addEventListener('input', formatCardNumber);
    document.getElementById('p-expiry').addEventListener('input', formatExpiry);
});

// ── Event banner ──────────────────────────────────────────────────────────────
function renderEventBanner() {
    const e = currentEvent;
    const pct = Math.round((e.bookedSeats / e.totalCapacity) * 100);
    document.getElementById('event-banner').innerHTML = `
        <div class="banner-info">
            <h3>${e.name}</h3>
            <span>📅 ${e.date}</span>
            <span>📍 ${e.venue}</span>
        </div>
        <div class="banner-seats">
            <span class="seats-left">${e.availableSeats} seats left</span>
            <div class="mini-bar"><div class="mini-fill" style="width:${pct}%"></div></div>
        </div>
    `;
}

// ── Seat type cards ───────────────────────────────────────────────────────────
function renderSeatTypes() {
    const grid = document.getElementById('seat-types-grid');
    grid.innerHTML = SEAT_TYPES.map(st => `
        <div class="seat-type-card" id="st-${st.id}" onclick="selectSeatType('${st.id}')">
            <div class="st-icon">${st.icon}</div>
            <div class="st-label">${st.label}</div>
            <div class="st-desc">${st.desc}</div>
            <div class="st-price">R ${(currentEvent.price * st.multiplier).toFixed(2)} / ticket</div>
        </div>
    `).join('');
}

function selectSeatType(id) {
    selectedSeatType = SEAT_TYPES.find(s => s.id === id);
    document.querySelectorAll('.seat-type-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`st-${id}`).classList.add('selected');
    document.getElementById('seat-error').style.display = 'none';
}

// ── Ticket counter ────────────────────────────────────────────────────────────
function changeTickets(delta) {
    const input = document.getElementById('s1-tickets');
    const max   = parseInt(input.max) || 10;
    input.value = Math.min(max, Math.max(1, parseInt(input.value) + delta));
}

// ── Step navigation ───────────────────────────────────────────────────────────
function goToStep(step) {
    // Validate before moving forward
    if (step > currentStep) {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
    }

    // Update stepper indicators
    for (let i = 1; i <= 4; i++) {
        const ind = document.getElementById(`step-indicator-${i}`);
        ind.classList.remove('active', 'done');
        if (i < step)  ind.classList.add('done');
        if (i === step) ind.classList.add('active');
    }

    // Show/hide panels
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${step}`).classList.add('active');

    // Populate order summary on step 3
    if (step === 3) renderOrderSummary();

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Validation ────────────────────────────────────────────────────────────────
function validateStep1() {
    const name   = document.getElementById('s1-name').value.trim();
    const email  = document.getElementById('s1-email').value.trim();
    const phone  = document.getElementById('s1-phone').value.trim();
    if (!name || !email || !phone) {
        alert('Please fill in all your details before continuing.');
        return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    return true;
}

function validateStep2() {
    if (!selectedSeatType) {
        document.getElementById('seat-error').style.display = 'block';
        return false;
    }
    return true;
}

// ── Order summary ─────────────────────────────────────────────────────────────
function renderOrderSummary() {
    const tickets   = parseInt(document.getElementById('s1-tickets').value);
    const unitPrice = currentEvent.price * selectedSeatType.multiplier;
    const total     = unitPrice * tickets;

    document.getElementById('order-summary').innerHTML = `
        <h4>Order Summary</h4>
        <div class="summary-row"><span>Event</span><span>${currentEvent.name}</span></div>
        <div class="summary-row"><span>Seat Type</span><span>${selectedSeatType.icon} ${selectedSeatType.label}</span></div>
        <div class="summary-row"><span>Tickets</span><span>${tickets}</span></div>
        <div class="summary-row"><span>Price per ticket</span><span>R ${unitPrice.toFixed(2)}</span></div>
        <div class="summary-row total-row"><span>Total</span><span>R ${total.toFixed(2)}</span></div>
    `;

    // Pre-fill cardholder name
    const name = document.getElementById('s1-name').value;
    document.getElementById('p-name').value = name;
}

// ── Card formatting ───────────────────────────────────────────────────────────
function formatCardNumber(e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
    e.target.value = v;
}

// ── Process payment & submit booking ─────────────────────────────────────────
async function processPayment() {
    const cardName   = document.getElementById('p-name').value.trim();
    const cardNumber = document.getElementById('p-card').value.trim();
    const expiry     = document.getElementById('p-expiry').value.trim();
    const cvv        = document.getElementById('p-cvv').value.trim();
    const errDiv     = document.getElementById('pay-error');
    errDiv.style.display = 'none';

    // Basic payment validation
    if (!cardName || !cardNumber || !expiry || !cvv) {
        errDiv.style.display = 'block';
        errDiv.textContent = '⚠️ Please fill in all payment details.';
        return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
        errDiv.style.display = 'block';
        errDiv.textContent = '⚠️ Please enter a valid 16-digit card number.';
        return;
    }
    if (cvv.length < 3) {
        errDiv.style.display = 'block';
        errDiv.textContent = '⚠️ CVV must be 3 digits.';
        return;
    }

    const btn = document.getElementById('pay-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Processing Payment...';

    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1500));

    // Submit booking to backend
    try {
        const tickets = parseInt(document.getElementById('s1-tickets').value);
        const name    = document.getElementById('s1-name').value.trim();
        const email   = document.getElementById('s1-email').value.trim();

        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId:       currentEvent.id,
                customerName:  name,
                customerEmail: email,
                tickets:       tickets
            })
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Booking failed');

        // Show confirmation
        showConfirmation(result, tickets);
        goToStep(4);

    } catch (err) {
        errDiv.style.display = 'block';
        errDiv.textContent = `⚠️ ${err.message}`;
        btn.disabled = false;
        btn.textContent = '🔒 Pay Now';
    }
}

// ── Confirmation ticket card ──────────────────────────────────────────────────
function showConfirmation(booking, tickets) {
    const unitPrice = currentEvent.price * selectedSeatType.multiplier;
    const total     = unitPrice * tickets;
    const phone     = document.getElementById('s1-phone').value;

    document.getElementById('ticket-card').innerHTML = `
        <div class="ticket-header">
            <span class="ticket-event">${booking.event.name}</span>
            <span class="ticket-ref">${booking.bookingReference}</span>
        </div>
        <div class="ticket-divider"><span>✂</span></div>
        <div class="ticket-body">
            <div class="ticket-row"><span>📅 Date</span><strong>${booking.event.date}</strong></div>
            <div class="ticket-row"><span>📍 Venue</span><strong>${booking.event.venue}</strong></div>
            <div class="ticket-row"><span>👤 Name</span><strong>${booking.customerName}</strong></div>
            <div class="ticket-row"><span>📧 Email</span><strong>${booking.customerEmail}</strong></div>
            <div class="ticket-row"><span>📞 Phone</span><strong>${phone}</strong></div>
            <div class="ticket-row"><span>💺 Seat Type</span><strong>${selectedSeatType.icon} ${selectedSeatType.label}</strong></div>
            <div class="ticket-row"><span>🎟️ Tickets</span><strong>${tickets}</strong></div>
            <div class="ticket-row highlight-row"><span>💰 Total Paid</span><strong>R ${total.toFixed(2)}</strong></div>
        </div>
    `;
}
