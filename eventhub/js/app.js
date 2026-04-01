const CATEGORIES = ['🎸 Concert','🎷 Jazz','💻 Tech','😂 Comedy','🍷 Festival'];

async function loadEvents() {
    try {
        const res    = await fetch('api/events.php');
        const events = await res.json();

        document.getElementById('loading').style.display     = 'none';
        document.getElementById('events-grid').style.display = 'grid';
        document.getElementById('event-count').textContent   = events.length + ' events';
        document.getElementById('stat-events').textContent   = events.length;

        document.getElementById('events-grid').innerHTML = events.map((e, i) => {
            const pct   = Math.round((e.booked_seats / e.total_capacity) * 100);
            const avail = parseInt(e.available_seats);
            let pillClass, pillText;
            if (avail === 0)      { pillClass='pill-red';    pillText='Sold Out'; }
            else if (avail <= 30) { pillClass='pill-orange'; pillText=`⚡ ${avail} left`; }
            else                  { pillClass='pill-green';  pillText=`✅ ${avail} available`; }
            const fillColor = pct>=80 ? '#ef4444' : pct>=50 ? '#f59e0b' : '#7c6fff';
            const btnClass  = avail === 0 ? 'btn-view sold' : 'btn-view';
            const btnText   = avail === 0 ? '❌ Sold Out' : '🎟️ View & Book';
            return `
            <div class="event-card" onclick="window.location.href='event-detail.html?id=${e.id}'">
                <div class="card-header">
                    <div class="card-category">${CATEGORIES[i]||'🎉 Event'}</div>
                    <div class="card-title">${e.name}</div>
                    <div class="card-meta">
                        <span>📅 ${e.date}</span>
                        <span>📍 ${e.venue}</span>
                    </div>
                </div>
                <div class="cap-bar-wrap">
                    <div class="cap-label"><span>Capacity</span><span>${pct}% booked</span></div>
                    <div class="cap-bar"><div class="cap-fill" style="width:${pct}%;background:${fillColor}"></div></div>
                </div>
                <div class="card-footer">
                    <div class="card-price">R ${parseFloat(e.price).toFixed(2)} <small>/ ticket</small></div>
                    <span class="seats-pill ${pillClass}">${pillText}</span>
                </div>
                <button class="${btnClass}" onclick="event.stopPropagation();${avail>0?`window.location.href='event-detail.html?id=${e.id}'`:''}">${btnText}</button>
            </div>`;
        }).join('');

        // booking count
        const br = await fetch('api/bookings.php');
        const bk = await br.json();
        document.getElementById('stat-bookings').textContent = bk.length;

    } catch {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display   = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const user = requireAuth();
    if (!user) return;
    document.getElementById('nav-avatar').textContent   = user.username[0].toUpperCase();
    document.getElementById('nav-username').textContent = user.username;
    loadEvents();
});
