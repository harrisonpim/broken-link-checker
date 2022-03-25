import fetch, { Response } from 'node-fetch'

const cache = new Map<string, Response>()

export async function fetchWithCache(url: string): Promise<Response> {
  if (cache.has(url)) {
    return cache.get(url)
  }
  const response = await fetch(url)
  cache.set(url, response)
  return response
}
