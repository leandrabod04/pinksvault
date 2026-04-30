// authService.js — Phase 2: Supabase Auth implementation
//
// Function signatures and return shapes are identical to the Phase 1
// localStorage version so AuthContext and all UI code need no changes.
//
// Return shape: { data: { user } | null, error: { message } | null }
// getSession:  { data: { session: { user } | null }, error: null }

import { supabase } from '../lib/supabase'

// ─── helper ───────────────────────────────────────────────────────────────────
// Supabase's user object is deeply nested. Flatten it to the shape the
// rest of the app already expects: { id, username, email, createdAt }

function normalizeUser(supabaseUser) {
  if (!supabaseUser) return null
  return {
    id:        supabaseUser.id,
    email:     supabaseUser.email,
    username:  supabaseUser.user_metadata?.username ?? '',
    createdAt: supabaseUser.created_at,
  }
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * username is passed via options.data so the database trigger can insert
 * a matching row into the profiles table automatically on signup.
 * @returns {{ data: { user } | null, error: { message } | null }}
 */
export async function signUp(username, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  if (error) return { data: null, error: { message: error.message } }

  // If email confirmation is enabled data.user exists but data.session is null.
  // For dev (confirmation disabled) both are present immediately.
  const user = normalizeUser(data.user)
  return { data: { user }, error: null }
}

/**
 * Log in with email + password.
 * @returns {{ data: { user } | null, error: { message } | null }}
 */
export async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { data: null, error: { message: error.message } }

  const user = normalizeUser(data.user)
  return { data: { user }, error: null }
}

/**
 * Log out the current user.
 * @returns {{ error: { message } | null }}
 */
export async function logOut() {
  const { error } = await supabase.auth.signOut()
  return { error: error ? { message: error.message } : null }
}

/**
 * Restore the session on app load.
 * Supabase persists the session in localStorage automatically and refreshes
 * the JWT in the background, so this works across page reloads.
 * @returns {{ data: { session: { user } | null }, error: null }}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return { data: { session: null }, error: null }
  }

  const user = normalizeUser(data.session.user)
  return { data: { session: { user } }, error: null }
}
