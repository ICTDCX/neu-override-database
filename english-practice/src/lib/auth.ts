export type AuthState = { email: string; userId: string; sessionId: string }

const AUTH_KEY = 'auth_state'
const DEVICE_KEY = 'device_id'

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

export function getAuth(): AuthState | null {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? (JSON.parse(raw) as AuthState) : null
}

export function setAuth(s: AuthState | null): void {
  if (s) localStorage.setItem(AUTH_KEY, JSON.stringify(s))
  else localStorage.removeItem(AUTH_KEY)
}