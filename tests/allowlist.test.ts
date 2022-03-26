import { filterAllowedLinks, getLinksOnPage } from '../src/sitemap'

import { readFileSync } from 'fs'

describe('Allowlist', () => {
  it('Should skip the allowed links on a page', async () => {
    const allowList = ['https://en.m.wikipedia.org/wiki/Hyperlink']

    const page = readFileSync('./tests/data/page.html', 'utf8')
    const links = await getLinksOnPage(page, 'https://example.com')

    const allowedLinks = filterAllowedLinks(links, allowList)

    expect(allowedLinks).toEqual(
      expect.arrayContaining([
        'https://en.m.wikipedia.org/wiki/HTML_element#heading',
        'https://en.m.wikipedia.org/wiki/HTML_element#Lists',
      ])
    )
  })
})
