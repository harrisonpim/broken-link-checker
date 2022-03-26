import fetch, { Response } from 'node-fetch'

const log = require('debug')('fetch')

const cache = new Map<string, Response>()

export async function fetchWithCache(url: string): Promise<Response> {
  if (cache.has(url)) {
    log(`Using cached response for ${url}`)
    return cache.get(url)
  }
  const response = await fetch(url)
  log(`Using fresh response for ${url}`)
  cache.set(url, response)
  return response
}
