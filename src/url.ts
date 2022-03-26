import { fetchWithCache } from './fetch'

const log = require('debug')('url')
export function makeUrlAbsolute(url, baseUrl) {
  if (!url.startsWith('http') && !url.startsWith('mailto')) {
    return `${baseUrl.replace(/^\/+|\/+$/g, '')}/${url.replace(
      /^\/+|\/+$/g,
      ''
    )}`
  }
  return url
}

export function getBaseUrl(url) {
  const urlObj = new URL(url)
  return urlObj.origin
}

export async function isBroken(url) {
  let broken = false
  if (url.startsWith('http')) {
    try {
      const status = await fetchWithCache(url)
      log(`${url} returned ${status}`)
      if (status !== 200) {
        broken = true
      }
    } catch (error) {
      log(`${url} returned ${error}`)
      broken = true
    }
  }
  return broken
}
