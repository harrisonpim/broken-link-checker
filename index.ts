import { getInput, setFailed, warning } from '@actions/core'
import { getLinksOnPage, getUrlsFromSitemap } from './src/sitemap'

import { fetchWithCache } from './src/fetch'
import { getBaseUrl } from './src/url'

async function run() {
  try {
    // Get the sitemap from github actions, or arguments if invoked from CLI
    const sitemapUrl = getInput('sitemap') || process.argv[2]

    // Get a list of allowed urls from the action input, or arguments if invoked from CLI.
    // The list should be formatted as a JSON array of strings, eg:
    // [
    //   "https://example.com/",
    //   "https://example.com/page1",
    //   "https://example.com/page2"
    // ]
    const rawAllowList = getInput('allowList') || process.argv[3]
    const allowList = JSON.parse(rawAllowList)

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
        const brokenLinksOnPage = []
        for (const url of linksOnPage) {
          if (url.startsWith('http') && !allowList.includes(url)) {
            try {
              const response = await fetchWithCache(url)
              const { status } = response
              if (status !== 200) {
                brokenLinksOnPage.push(url)
              }
            } catch (error) {
              brokenLinksOnPage.push(url)
            }
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
