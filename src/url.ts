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

export async function isBroken(url, allowList) {
  let broken = false
  const inAllowList = allowList.includes(url)
  if (inAllowList) {
    log(`${url} is in the allow list`)
  } else if (url.startsWith('http')) {
    try {
      const response = await fetchWithCache(url)
      const { status } = response
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
