/**
 * auth.js - Authentication: Login, Signup, Session management
 *
 * - sessionStorage: holds the current logged-in user (cleared on tab close)
 * - localStorage:   holds all registered users (persists across sessions)
 *
 * Default accounts are seeded on first load.
 */

// ── Seed default users into localStorage if not already there ─────────────────
function seedDefaultUsers() {
    if (!localStorage.getItem('eventhub_users')) {
        const defaults = [
            { username: 'admin', password: 'admin123', role: 'Admin', fullname: 'Administrator', email: 'admin@eventhub.com' },
            { username: 'user',  password: 'user123',  role: 'Guest', fullname: 'Demo User',      email: 'user@eventhub.com'  }
        ];
        localStorage.setItem('eventhub_users', JSON.stringify(defaults));
    }
}
seedDefaultUsers();

function getUsers() {
    return JSON.parse(localStorage.getItem('eventhub_users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('eventhub_users', JSON.stringify(users));
}

// ── Session helpers ────────────────────────────────────────────────────────────
function requireAuth() {
    const session = sessionStorage.getItem('eventhub_user');
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(session);
}

function getUser() {
    const session = sessionStorage.getItem('eventhub_user');
    return session ? JSON.parse(session) : null;
}

function logout() {
    sessionStorage.removeItem('eventhub_user');
    window.location.href = 'login.html';
}

// ── LOGIN form ─────────────────────────────────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
    if (getUser()) { window.location.href = 'index.html'; }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        const users = getUsers();
        const match = users.find(u => u.username === username && u.password === password);

        if (match) {
            sessionStorage.setItem('eventhub_user', JSON.stringify({
                username: match.username,
                role: match.role,
                fullname: match.fullname
            }));
            window.location.href = 'index.html';
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = '⚠️ Invalid username or password.';
        }
    });
}

// ── SIGNUP form ────────────────────────────────────────────────────────────────
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    if (getUser()) { window.location.href = 'index.html'; }

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const errorDiv   = document.getElementById('signup-error');
        const successDiv = document.getElementById('signup-success');
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';

        const fullname  = document.getElementById('fullname').value.trim();
        const email     = document.getElementById('email').value.trim();
        const username  = document.getElementById('new-username').value.trim();
        const password  = document.getElementById('new-password').value;
        const confirm   = document.getElementById('confirm-password').value;

        // Validation
        if (password !== confirm) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = '⚠️ Passwords do not match.';
            return;
        }

        const users = getUsers();

        if (users.find(u => u.username === username)) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = '⚠️ Username already taken. Choose another.';
            return;
        }

        if (users.find(u => u.email === email)) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = '⚠️ Email already registered.';
            return;
        }

        // Save new user
        users.push({ username, password, role: 'Guest', fullname, email });
        saveUsers(users);

        // Show success then redirect to login
        successDiv.style.display = 'block';
        successDiv.textContent = `✅ Account created! Redirecting to login...`;
        signupForm.reset();

        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    });
}
