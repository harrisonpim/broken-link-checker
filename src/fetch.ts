import fetch from 'node-fetch'

const log = require('debug')('fetch')

const cache = new Map<string, number>()

export async function fetchWithCache(url: string): Promise<number> {
  if (cache.has(url)) {
    log(`Using cached response for ${url}`)
    return cache.get(url)
  }
  const response = await fetch(url)
  log(`Using fresh response for ${url}`)
  cache.set(url, response.status)
  return response.status
}
