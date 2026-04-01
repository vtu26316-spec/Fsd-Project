/**
 * auth.js - Authentication logic
 *
 * We store the logged-in user in sessionStorage.
 * sessionStorage persists for the browser tab session only —
 * closing the tab logs the user out automatically.
 *
 * For the demo we use hardcoded credentials.
 * In a real app these would be validated by the backend via POST /api/auth/login
 */

const USERS = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'user',  password: 'user123',  role: 'Guest' }
];

/**
 * Call this at the top of every protected page.
 * Redirects to login.html if no session exists.
 */
function requireAuth() {
    const session = sessionStorage.getItem('eventhub_user');
    if (!session) {
        window.location.href = 'login.html';
    }
    return JSON.parse(session);
}

/**
 * Returns the current logged-in user object, or null.
 */
function getUser() {
    const session = sessionStorage.getItem('eventhub_user');
    return session ? JSON.parse(session) : null;
}

/**
 * Logs the user out and redirects to login page.
 */
function logout() {
    sessionStorage.removeItem('eventhub_user');
    window.location.href = 'login.html';
}

// ── Login form handler (only runs on login.html) ──────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {

    // If already logged in, skip login page
    if (getUser()) {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        // Find matching user
        const match = USERS.find(u => u.username === username && u.password === password);

        if (match) {
            // Save session (without password)
            sessionStorage.setItem('eventhub_user', JSON.stringify({
                username: match.username,
                role: match.role
            }));
            window.location.href = 'index.html';
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = '⚠️ Invalid username or password. Try admin / admin123';
        }
    });
}
