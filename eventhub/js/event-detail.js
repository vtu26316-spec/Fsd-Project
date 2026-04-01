let currentEvent = null;

async function loadEvent() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { window.location.href = 'index.html'; return; }

    try {
        const res = await fetch(`api/events.php?id=${id}`);
        if (!res.ok) throw new Error();
        currentEvent = await res.json();
        render(currentEvent);
    } catch {
        document.getElementById('loading').innerHTML = '<p class="error-msg">⚠️ Could not load event.</p>';
    }
}

function render(e) {
    document.getElementById('loading').style.display      = 'none';
    document.getElementById('event-detail').style.display = 'block';
    document.title = `${e.name} — EventHub`;

    const pct   = Math.round((e.booked_seats / e.total_capacity) * 100);
    const avail = parseInt(e.available_seats);

    const tag = document.getElementById('detail-tag');
    if (avail === 0)    { tag.textContent='SOLD OUT';     tag.className='detail-tag tag-red'; }
    else if (pct >= 70) { tag.textContent='FILLING FAST'; tag.className='detail-tag tag-orange'; }
    else                { tag.textContent='AVAILABLE';    tag.className='detail-tag tag-green'; }

    document.getElementById('detail-name').textContent  = e.name;
    document.getElementById('detail-date').textContent  = `📅 ${e.date}`;
    document.getElementById('detail-venue').textContent = `📍 ${e.venue}`;
    document.getElementById('detail-desc').textContent  = e.description;
    document.getElementById('detail-price').textContent = `R ${parseFloat(e.price).toFixed(2)}`;

    const fill = document.getElementById('detail-cap-fill');
    fill.style.width      = `${pct}%`;
    fill.style.background = pct>=80 ? '#ef4444' : pct>=50 ? '#f59e0b' : '#7c6fff';
    document.getElementById('detail-cap-text').textContent = `${avail} of ${e.total_capacity} available`;

    if (avail === 0) {
        const btn = document.getElementById('book-btn');
        btn.disabled = true; btn.textContent = '❌ Sold Out';
    }
}

function goBook() {
    window.location.href = `booking.html?id=${currentEvent.id}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth();
    if (!user) return;
    document.getElementById('nav-avatar').textContent   = user.username[0].toUpperCase();
    document.getElementById('nav-username').textContent = user.username;
    loadEvent();
});
