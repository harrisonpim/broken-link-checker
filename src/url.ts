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
  let statusCode = 200
  if (url.startsWith('http')) {
    try {
      statusCode = await fetchWithCache(url)
      log(`${url} returned ${statusCode}`)
      if (statusCode !== 200) {
        broken = true
      }
    } catch (error) {
      log(`Failed to fetch ${url}`)
      broken = true
      statusCode = 500
    }
  } else {
    log(`${url} is not a valid url`)
    broken = true
    statusCode = 500
  }
  return { broken, statusCode }
}
