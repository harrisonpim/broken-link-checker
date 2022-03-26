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
