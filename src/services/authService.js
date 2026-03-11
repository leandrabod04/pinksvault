// authService.js — Phase 1: localStorage implementation
//
// All functions return { data, error } to match the Supabase client shape.
// When upgrading to Supabase (Phase 2), replace the bodies of these functions
// with supabase.auth calls — the signatures and return shapes stay identical.
//
// Storage keys
const USERS_KEY   = 'pv_users'
const SESSION_KEY = 'pv_session'

// ─── helpers ──────────────────────────────────────────────────────────────────

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(user) {
  // Never persist the password in the session
  const { password: _pw, ...safeUser } = user
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
  return safeUser
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @returns {{ data: { user } | null, error: { message: string } | null }}
 */
export async function signUp(username, email, password) {
  const users = getUsers()

  if (users.find((u) => u.email === email)) {
    return { data: null, error: { message: 'An account with this email already exists.' } }
  }
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { data: null, error: { message: 'That username is already taken.' } }
  }

  const newUser = {
    id:        crypto.randomUUID(),
    username,
    email,
    password, // plain text — acceptable for local dev; Supabase handles hashing in Phase 2
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])
  const user = saveSession(newUser)
  return { data: { user }, error: null }
}

/**
 * Log in with email + password.
 * @returns {{ data: { user } | null, error: { message: string } | null }}
 */
export async function logIn(email, password) {
  const users = getUsers()
  const found = users.find((u) => u.email === email && u.password === password)

  if (!found) {
    return { data: null, error: { message: 'Incorrect email or password.' } }
  }

  const user = saveSession(found)
  return { data: { user }, error: null }
}

/**
 * Log out the current user.
 * @returns {{ error: null }}
 */
export async function logOut() {
  clearSession()
  return { error: null }
}

/**
 * Restore the session from storage (called on app load).
 * @returns {{ data: { session: { user } | null }, error: null }}
 */
export async function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  const user = raw ? JSON.parse(raw) : null
  return { data: { session: user ? { user } : null }, error: null }
}
