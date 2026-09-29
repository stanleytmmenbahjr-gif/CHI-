const apiBaseUrl = (import.meta.env.VITE_CONTACT_API_URL || '').replace(/\/$/, '')

export async function submitContactMessage(payload) {
  let response

  try {
    response = await fetch(`${apiBaseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('We could not reach the contact service. Please try again shortly.')
  }

  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message || 'Your message could not be sent. Please try again.')
  }

  return result
}