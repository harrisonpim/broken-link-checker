import { getInput, setFailed, warning } from '@actions/core'
import { getLinksOnPage, getUrlsFromSitemap } from './src/sitemap'

import { fetchWithCache } from './src/fetch'
import { getBaseUrl } from './src/url'

async function run() {
  try {
    // get the sitemap from github actions, or arguments if invoked from CLI
    const sitemapUrl = getInput('sitemap') || process.argv[2]

    // construct the base url from the sitemap url
    const baseUrl = getBaseUrl(sitemapUrl)

    // fetch the sitemap and parse a list of URLs from it
    const sitemap = await fetchWithCache(sitemapUrl).then((res) => res.text())
    const urls = await getUrlsFromSitemap(sitemap)

    // we'll return an object with each URL from the sitemap keys and a list
    // of any links which do not return a 200 as the values
    const brokenLinks = {}
    for (const url of urls) {
      try {
        const page = await fetchWithCache(url).then((res) => res.text())
        const linksOnPage = await getLinksOnPage(page, baseUrl)
        const brokenLinksOnPage = []
        for (const url of linksOnPage) {
          if (url.startsWith('http')) {
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

    // construct a failure message for any links which don't return a 200
    const failureMessages = []
    for (const url in brokenLinks) {
      if (brokenLinks[url].length > 0) {
        failureMessages.push(
          `${url} contains broken links:\n${brokenLinks[url].join(', ')}\n`
        )
      }
    }

    // if there are any broken links, set the action status to failure
    if (failureMessages.length > 0) {
      setFailed(failureMessages.join('\n'))
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
