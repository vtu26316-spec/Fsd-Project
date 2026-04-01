const API = 'api/auth.php';

function getUser() {
    const s = sessionStorage.getItem('eventhub_user');
    return s ? JSON.parse(s) : null;
}

function requireAuth() {
    const user = getUser();
    if (!user) { window.location.href = 'login.html'; return null; }
    return user;
}

function logout() {
    sessionStorage.removeItem('eventhub_user');
    window.location.href = 'login.html';
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
    if (getUser()) { window.location.href = 'index.html'; }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const err = document.getElementById('login-error');
        err.style.display = 'none';
        btn.disabled = true; btn.textContent = 'Signing in...';

        try {
            const res  = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action:   'login',
                    username: document.getElementById('username').value.trim(),
                    password: document.getElementById('password').value
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            sessionStorage.setItem('eventhub_user', JSON.stringify(data));
            window.location.href = 'index.html';
        } catch (e) {
            err.style.display = 'block';
            err.textContent = '⚠️ ' + e.message;
            btn.disabled = false; btn.textContent = 'Sign In';
        }
    });
}

// ── SIGNUP ─────────────────────────────────────────────────────────────────
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    if (getUser()) { window.location.href = 'index.html'; }

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const err = document.getElementById('signup-error');
        const suc = document.getElementById('signup-success');
        err.style.display = 'none'; suc.style.display = 'none';

        const pass    = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;
        if (pass !== confirm) {
            err.style.display = 'block'; err.textContent = '⚠️ Passwords do not match.'; return;
        }

        try {
            const res  = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action:   'signup',
                    fullname: document.getElementById('fullname').value.trim(),
                    email:    document.getElementById('email').value.trim(),
                    username: document.getElementById('new-username').value.trim(),
                    password: pass
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            suc.style.display = 'block';
            suc.textContent = '✅ Account created! Redirecting to login...';
            setTimeout(() => window.location.href = 'login.html', 1500);
        } catch (e) {
            err.style.display = 'block'; err.textContent = '⚠️ ' + e.message;
        }
    });
}
