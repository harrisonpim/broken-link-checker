import { getLinksOnPage, getUrlsFromSitemap } from '../src/sitemap'

import fs from 'fs'

describe('Sitemap', () => {
  it('should find the correct set of urls in a sitemap', async () => {
    const sitemap = fs.readFileSync('./tests/data/sitemap.xml', 'utf8')
    const urls = getUrlsFromSitemap(sitemap)
    expect(urls).toEqual(
      expect.arrayContaining([
        'https://example.com',
        'https://example.com/something',
        'https://example.com/something/else',
      ])
    )
  })

  it('should find the correct set of links on a page', async () => {
    const page = fs.readFileSync('./tests/data/page.html', 'utf8')
    const links = await getLinksOnPage(page, 'https://example.com')
    expect(links).toEqual(
      expect.arrayContaining([
        'https://en.m.wikipedia.org/wiki/Hyperlink',
        'https://en.m.wikipedia.org/wiki/HTML_element#heading',
        'https://en.m.wikipedia.org/wiki/HTML_element#Lists',
      ])
    )
  })
})
