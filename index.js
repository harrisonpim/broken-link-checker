const core = require("@actions/core");
const github = require("@actions/github");
const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function makeUrlAbsolute(url, baseUrl) {
  if (!url.startsWith("http") & !url.startsWith("mailto")) {
    return baseUrl + url;
  }
  return url;
}

(async () => {
  try {
    const sitemapUrl = core.getInput("sitemap");

    // construct the base url from the sitemap url
    const baseUrl = sitemapUrl.substring(0, sitemapUrl.lastIndexOf("/"));

    const sitemap = await fetch(sitemapUrl).then((res) => res.text());
    // fetch the sitemap and parse a list of URLs from it
    const urls = [];
    const $ = cheerio.load(sitemap, { xmlMode: true });
    $("loc").each(function () {
      const url = $(this).text();
      if (!urls.includes(url)) {
        urls.push(url);
      }
    });

    // find all links on each of the pages on the sitemap returning an object
    // with the URL as the key and a list of links as the value
    const links = {};
    for (const url of urls) {
      const page = await fetch(url).then((res) => res.text());
      const $ = cheerio.load(page);
      const pageLinks = [];
      $("a").each(function () {
        const link = $(this).attr("href");
        if (!pageLinks.includes(link)) {
          const absoluteLink = makeUrlAbsolute(link, baseUrl);
          pageLinks.push(absoluteLink);
        }
      });
      links[url] = pageLinks;
    }

    // for each page, gather a list of any links which do not return a 200
    const brokenLinks = {};
    for (const url in links) {
      for (const link of links[url]) {
        const brokenPageLinks = [];
        if (link.startsWith("http")) {
          const res = await fetch(link);
          if (res.status !== 200) {
            brokenPageLinks.push(link);
          }
        }
        brokenLinks[url] = brokenPageLinks;
      }
    }

    console.log(brokenLinks);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
