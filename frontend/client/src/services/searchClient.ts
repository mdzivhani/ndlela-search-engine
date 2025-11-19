export async function search(q: string) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  const resp = await fetch('/api/search?' + params.toString())
  if (!resp.ok) throw new Error('Search failed')
  return await resp.json()
}
