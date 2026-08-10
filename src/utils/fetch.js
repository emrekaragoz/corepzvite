export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const message = `Request failed (${response.status}) for ${url}`
    throw new Error(message)
  }
  return response.json()
}
