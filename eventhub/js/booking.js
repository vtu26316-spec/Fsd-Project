let currentEvent    = null;
let currentStep     = 1;
let selectedSeat    = null;

const SEAT_TYPES = [
    { id:'economy',  label:'Economy',  icon:'🪑', desc:'Standard seating, great view',         multiplier:1.0 },
    { id:'standard', label:'Standard', icon:'💺', desc:'Comfortable seats with extra legroom',  multiplier:1.5 },
    { id:'vip',      label:'VIP',      icon:'⭐', desc:'Premium front-row VIP experience',      multiplier:2.5 }
];

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const user = requireAuth();
    if (!user) return;
    document.getElementById('nav-avatar').textContent   = user.username[0].toUpperCase();
    document.getElementById('nav-username').textContent = user.username;

    // Auto-fill name
    if (user.fullname) document.getElementById('s1-name').value = user.fullname;

    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { window.location.href = 'index.html'; return; }

    try {
        const res = await fetch(`api/events.php?id=${id}`);
        currentEvent = await res.json();
        renderBanner();
        renderSeatTypes();
        document.getElementById('s1-tickets').max = Math.min(parseInt(currentEvent.available_seats), 10);
    } catch {
        document.querySelector('.container').innerHTML = '<p class="error-msg">⚠️ Could not load event.</p>';
    }

    document.getElementById('p-card').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g,'').substring(0,16);
        e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
    });
    document.getElementById('p-expiry').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g,'').substring(0,4);
        if (v.length >= 2) v = v.substring(0,2)+'/'+v.substring(2);
        e.target.value = v;
    });
});

function renderBanner() {
    const e   = currentEvent;
    const pct = Math.round((e.booked_seats / e.total_capacity) * 100);
    document.getElementById('event-banner').innerHTML = `
        <div class="banner-info">
            <h3>${e.name}</h3>
            <span>📅 ${e.date}</span>
            <span>📍 ${e.venue}</span>
        </div>
        <div class="banner-seats">
            <span class="seats-left">${e.available_seats} seats left</span>
            <div class="mini-bar"><div class="mini-fill" style="width:${pct}%"></div></div>
        </div>`;
}

function renderSeatTypes() {
    document.getElementById('seat-types-grid').innerHTML = SEAT_TYPES.map(st => `
        <div class="seat-type-card" id="st-${st.id}" onclick="selectSeat('${st.id}')">
            <div class="st-icon">${st.icon}</div>
            <div class="st-label">${st.label}</div>
            <div class="st-desc">${st.desc}</div>
            <div class="st-price">R ${(parseFloat(currentEvent.price) * st.multiplier).toFixed(2)} / ticket</div>
        </div>`).join('');
}

function selectSeat(id) {
    selectedSeat = SEAT_TYPES.find(s => s.id === id);
    document.querySelectorAll('.seat-type-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`st-${id}`).classList.add('selected');
    document.getElementById('seat-error').style.display = 'none';
}

function changeTickets(delta) {
    const input = document.getElementById('s1-tickets');
    const max   = parseInt(input.max) || 10;
    input.value = Math.min(max, Math.max(1, parseInt(input.value) + delta));
}

// ── Step navigation ───────────────────────────────────────────────────────────
function goStep(step) {
    if (step > currentStep) {
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
    }

    for (let i = 1; i <= 4; i++) {
        const el = document.getElementById(`si-${i}`);
        el.classList.remove('active','done');
        if (i < step)  el.classList.add('done');
        if (i === step) el.classList.add('active');
    }

    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${step}`).classList.add('active');

    if (step === 3) renderOrderSummary();
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep1() {
    const name  = document.getElementById('s1-name').value.trim();
    const email = document.getElementById('s1-email').value.trim();
    const phone = document.getElementById('s1-phone').value.trim();
    if (!name || !email || !phone) { alert('Please fill in all your details.'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { alert('Please enter a valid email.'); return false; }
    return true;
}

function validateStep2() {
    if (!selectedSeat) { document.getElementById('seat-error').style.display='block'; return false; }
    return true;
}

function renderOrderSummary() {
    const tickets   = parseInt(document.getElementById('s1-tickets').value);
    const unitPrice = parseFloat(currentEvent.price) * selectedSeat.multiplier;
    const total     = unitPrice * tickets;
    document.getElementById('order-summary').innerHTML = `
        <h4>Order Summary</h4>
        <div class="summary-row"><span>Event</span><span>${currentEvent.name}</span></div>
        <div class="summary-row"><span>Seat Type</span><span>${selectedSeat.icon} ${selectedSeat.label}</span></div>
        <div class="summary-row"><span>Tickets</span><span>${tickets}</span></div>
        <div class="summary-row"><span>Price per ticket</span><span>R ${unitPrice.toFixed(2)}</span></div>
        <div class="summary-row total-row"><span>Total</span><span>R ${total.toFixed(2)}</span></div>`;
    document.getElementById('p-name').value = document.getElementById('s1-name').value;
}

// ── Payment ───────────────────────────────────────────────────────────────────
async function processPayment() {
    const card   = document.getElementById('p-card').value.trim();
    const expiry = document.getElementById('p-expiry').value.trim();
    const cvv    = document.getElementById('p-cvv').value.trim();
    const pname  = document.getElementById('p-name').value.trim();
    const errDiv = document.getElementById('pay-error');
    errDiv.style.display = 'none';

    if (!pname || !card || !expiry || !cvv) {
        errDiv.style.display='block'; errDiv.textContent='⚠️ Please fill in all payment details.'; return;
    }
    if (card.replace(/\s/g,'').length < 16) {
        errDiv.style.display='block'; errDiv.textContent='⚠️ Enter a valid 16-digit card number.'; return;
    }
    if (cvv.length < 3) {
        errDiv.style.display='block'; errDiv.textContent='⚠️ CVV must be 3 digits.'; return;
    }

    const btn = document.getElementById('pay-btn');
    btn.disabled = true; btn.textContent = '⏳ Processing...';

    await new Promise(r => setTimeout(r, 1500)); // simulate payment delay

    try {
        const res = await fetch('api/bookings.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId:       currentEvent.id,
                customerName:  document.getElementById('s1-name').value.trim(),
                customerEmail: document.getElementById('s1-email').value.trim(),
                customerPhone: document.getElementById('s1-phone').value.trim(),
                tickets:       parseInt(document.getElementById('s1-tickets').value),
                seatType:      selectedSeat.id
            })
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Booking failed');

        showConfirmation(result);
        goStep(4);

    } catch (err) {
        errDiv.style.display = 'block';
        errDiv.textContent   = `⚠️ ${err.message}`;
        btn.disabled = false; btn.textContent = '🔒 Pay Now';
    }
}

// ── Confirmation ticket ───────────────────────────────────────────────────────
function showConfirmation(b) {
    document.getElementById('ticket-card').innerHTML = `
        <div class="ticket-header">
            <span class="ticket-event">${b.event.name}</span>
            <span class="ticket-ref">${b.bookingReference}</span>
        </div>
        <div class="ticket-divider"><span>✂</span></div>
        <div class="ticket-body">
            <div class="ticket-row"><span>📅 Date</span><strong>${b.event.date}</strong></div>
            <div class="ticket-row"><span>📍 Venue</span><strong>${b.event.venue}</strong></div>
            <div class="ticket-row"><span>👤 Name</span><strong>${b.customerName}</strong></div>
            <div class="ticket-row"><span>📧 Email</span><strong>${b.customerEmail}</strong></div>
            <div class="ticket-row"><span>📞 Phone</span><strong>${b.customerPhone}</strong></div>
            <div class="ticket-row"><span>💺 Seat Type</span><strong>${selectedSeat.icon} ${selectedSeat.label}</strong></div>
            <div class="ticket-row"><span>🎟️ Tickets</span><strong>${b.tickets}</strong></div>
            <div class="ticket-row highlight-row"><span>💰 Total Paid</span><strong>R ${parseFloat(b.totalPrice).toFixed(2)}</strong></div>
        </div>`;
}
