import cheerio from 'cheerio'
import { makeUrlAbsolute } from './url'

export function getUrlsFromSitemap(sitemap) {
  const urls = []
  const $ = cheerio.load(sitemap, { xmlMode: true })
  $('loc').each(function () {
    const url = $(this).text()
    if (!urls.includes(url)) {
      urls.push(url)
    }
  })
  return urls
}

export async function getLinksOnPage(page, baseUrl) {
  const $ = cheerio.load(page, { xmlMode: true })
  const linksOnPage = []
  $('a').each(function () {
    const href = $(this).attr('href')
    if (href) {
      const absoluteUrl = makeUrlAbsolute(href, baseUrl)
      linksOnPage.push(absoluteUrl)
    }
  })
  return linksOnPage
}

export function filterAllowedLinks(links, allowList) {
  return links.filter((link) => !allowList.includes(link))
}
