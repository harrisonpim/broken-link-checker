import {
  filterAllowedLinks,
  getLinksOnPage,
  getUrlsFromSitemap,
} from './src/sitemap'
import { getBaseUrl, isBroken } from './src/url'
import { setFailed, warning } from '@actions/core'

import { fetchWithCache } from './src/fetch'
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

    // Construct the base url from the sitemap url
    const baseUrl = getBaseUrl(sitemapUrl)

    // Fetch the sitemap and parse a list of URLs from it
    const sitemap = await fetchWithCache(sitemapUrl).then((res) => res.text())
    const urls = await getUrlsFromSitemap(sitemap)

    // We'll return an object with each URL from the sitemap keys and a list
    // of any links which do not return a 200 as the values
    const brokenLinks = {}
    for (const url of urls) {
      try {
        const page = await fetchWithCache(url).then((res) => res.text())
        const linksOnPage = await getLinksOnPage(page, baseUrl)
        const linksToCheck = filterAllowedLinks(linksOnPage, allowList)
        const brokenLinksOnPage = []
        for (const url of linksToCheck) {
          if (await isBroken(url)) {
            brokenLinksOnPage.push(url)
          }
        }
        brokenLinks[url] = brokenLinksOnPage
      } catch (error) {
        warning(`Failed to fetch ${url}`)
        brokenLinks[url] = []
      }
    }

    // Construct a failure message for any links which don't return a 200
    const failureMessages = []
    for (const url in brokenLinks) {
      if (brokenLinks[url].length > 0) {
        failureMessages.push(
          `${url} contains broken links:\n${brokenLinks[url].join(', ')}\n`
        )
      }
    }

    // If there are any broken links, set the action status to failure
    if (failureMessages.length > 0) {
      setFailed(failureMessages.join('\n'))
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
