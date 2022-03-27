import {
  filterAllowedLinks,
  getLinksOnPage,
  getUrlsFromSitemap,
} from './src/sitemap'
import { getBaseUrl, isBroken } from './src/url'
import { setFailed, warning } from '@actions/core'

import fetch from 'node-fetch'
import { gatherArgs } from './src/args'

const log = require('debug')('index')

async function run() {
  try {
    const args = await gatherArgs({
      sitemap: {
        type: 'string',
        describe: 'The sitemap to crawl',
      },
      allowList: {
        type: 'string',
        describe: 'A JSON array of allowed urls',
      },
    })
    const sitemapUrl = args.sitemap
    const rawAllowList = args.allowList || '[]'
    const allowList = JSON.parse(rawAllowList)
    log(`Using sitemap: ${sitemapUrl}`)
    log(`Using allowList: ${JSON.stringify(allowList, null, 2)}`)

    const baseUrl = getBaseUrl(sitemapUrl)

    const sitemap = await fetch(sitemapUrl).then((res) => res.text())
    const urls = await getUrlsFromSitemap(sitemap)

    const brokenLinks = {}
    for (const url of urls) {
      try {
        log(`Checking ${url}`)
        const page = await fetch(url).then((res) => res.text())
        const linksOnPage = await getLinksOnPage(page, baseUrl)
        const linksToCheck = filterAllowedLinks(linksOnPage, allowList)
        const brokenLinksOnPage = []
        for (const url of linksToCheck) {
          if (await isBroken(url)) {
            brokenLinksOnPage.push(url)
          }
        }
        log(`Found ${brokenLinksOnPage.length} broken links on ${url}`)
        brokenLinks[url] = brokenLinksOnPage
      } catch (error) {
        warning(`Failed to fetch ${url}`)
        brokenLinks[url] = []
      }
    }

    const failureMessages = []
    for (const url in brokenLinks) {
      if (brokenLinks[url].length > 0) {
        failureMessages.push(
          `${url} contains broken links:\n${brokenLinks[url].join(', ')}\n`
        )
      }
    }

    if (failureMessages.length > 0) {
      setFailed(failureMessages.join('\n'))
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
