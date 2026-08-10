export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const message = `Request failed (${response.status}) for ${url}`
    throw new Error(message)
  }
  return response.json()
}

export function getTrades() {
  return fetchJson(`${API_BASE}/api/trades`)
}

export function getPosition() {
  return fetchJson(`${API_BASE}/api/position`)
}
