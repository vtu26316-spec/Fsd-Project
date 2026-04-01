const API = '/api';

const CATEGORIES = ['🎸 Concert','🎷 Jazz','💻 Tech','😂 Comedy','🍷 Festival'];

async function loadEvents() {
    try {
        const res    = await fetch(`${API}/events`);
        const events = await res.json();

        document.getElementById('loading').style.display      = 'none';
        document.getElementById('events-grid').style.display  = 'grid';
        document.getElementById('event-count').textContent    = `${events.length} events`;
        document.getElementById('stat-events').textContent    = events.length;

        document.getElementById('events-grid').innerHTML =
            events.map((e, i) => buildCard(e, i)).join('');

        // fetch booking count for stat
        const br = await fetch(`${API}/bookings`);
        const bk = await br.json();
        document.getElementById('stat-bookings').textContent = bk.length;

    } catch {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display   = 'block';
    }
}

function buildCard(e, i) {
    const pct  = Math.round((e.bookedSeats / e.totalCapacity) * 100);
    const avail = e.availableSeats;

    let pillClass, pillText;
    if (avail === 0)       { pillClass='pill-red';    pillText='Sold Out'; }
    else if (avail <= 30)  { pillClass='pill-orange'; pillText=`⚡ ${avail} left`; }
    else                   { pillClass='pill-green';  pillText=`✅ ${avail} available`; }

    const fillColor = pct>=80 ? '#ef4444' : pct>=50 ? '#f59e0b' : '#7c6fff';

    const btnClass = avail === 0 ? 'btn-view sold' : 'btn-view';
    const btnText  = avail === 0 ? '❌ Sold Out' : '🎟️ View & Book';
    const btnClick = avail === 0 ? '' : `onclick="window.location.href='event-detail.html?id=${e.id}'"`;

    return `
    <div class="event-card" onclick="window.location.href='event-detail.html?id=${e.id}'">
        <div class="card-header">
            <div class="card-category">${CATEGORIES[i] || '🎉 Event'}</div>
            <div class="card-title">${e.name}</div>
            <div class="card-meta">
                <span>📅 ${e.date}</span>
                <span>📍 ${e.venue}</span>
            </div>
        </div>
        <div class="capacity-bar-wrap">
            <div class="cap-label"><span>Capacity</span><span>${pct}% booked</span></div>
            <div class="cap-bar"><div class="cap-fill" style="width:${pct}%;background:${fillColor}"></div></div>
        </div>
        <div class="card-footer">
            <div class="card-price">R ${e.price.toFixed(2)} <small>/ ticket</small></div>
            <span class="seats-pill ${pillClass}">${pillText}</span>
        </div>
        <button class="${btnClass}" ${btnClick} onclick="event.stopPropagation(); ${avail>0?`window.location.href='event-detail.html?id=${e.id}'`:''}">${btnText}</button>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth();
    document.getElementById('nav-avatar').textContent   = user.username[0].toUpperCase();
    document.getElementById('nav-username').textContent = user.username;
    loadEvents();
});
