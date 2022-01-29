const core = require("@actions/core");
const github = require("@actions/github");
const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function makeUrlAbsolute(url, baseUrl) {
  if (!url.startsWith("http") & !url.startsWith("mailto")) {
    return (
      baseUrl.replace(/^\/+|\/+$/g, "") + "/" + url.replace(/^\/+|\/+$/g, "")
    );
  }
  return url;
}

(async () => {
  try {
    const sitemapUrl = core.getInput("sitemap");

    // construct the base url from the sitemap url
    const baseUrl = sitemapUrl.substring(0, sitemapUrl.lastIndexOf("/") + 1);

    // fetch the sitemap and parse a list of URLs from it
    const sitemap = await fetch(sitemapUrl).then((res) => res.text());
    const urls = [];
    const $ = cheerio.load(sitemap, { xmlMode: true });
    $("loc").each(function () {
      const url = $(this).text();
      if (!urls.includes(url)) {
        urls.push(url);
      }
    });

    // we'll return an object with each URL from the sitemap keys and a list
    // of any links which do not return a 200 as the values
    const brokenLinks = {};
    for (const url of urls) {
      try {
        const response = await fetch(url).then((res) => res.text());
        const $ = cheerio.load(response, { xmlMode: true });
        const linksOnPage = [];
        $("a").each(function () {
          const href = $(this).attr("href");
          if (href) {
            linksOnPage.push(makeUrlAbsolute(href, baseUrl));
          }
        });
        const brokenLinksOnPage = [];
        for (const url of linksOnPage) {
          if (url.startsWith("http")) {
            try {
              const response = await fetch(url);
              const status = response.status;
              if (status !== 200) {
                brokenLinksOnPage.push(url);
              }
            } catch (error) {
              brokenLinksOnPage.push(url);
            }
          }
        }
        brokenLinks[url] = brokenLinksOnPage;
      } catch (error) {
        core.warning(`Failed to fetch ${url}`);
        brokenLinks[url] = [];
      }
    }

    // construct a failure message for any links which don't return a 200
    const failureMessages = [];
    for (const url in brokenLinks) {
      if (brokenLinks[url].length > 0) {
        failureMessages.push(
          `${url} contains broken links:\n${brokenLinks[url].join(", ")}\n`
        );
      }
    }

    // if there are any broken links, set the action status to failure
    if (failureMessages.length > 0) {
      core.setFailed(failureMessages.join("\n"));
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
})();
