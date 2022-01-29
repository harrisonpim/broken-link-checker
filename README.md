# 🔗 Broken link checker

This action takes a sitemap as input, and checks each of its URLs for broken links.

## Inputs

- `sitemap`: **Required** The URL of the sitemap to crawl.

## Outputs

- `broken-links`: A list of broken links found, with the page they were found on.

## Example usage

Copy the following into a file called `.github/workflows/broken-links.yml`, and remember to edit the `sitemap` input to point to your own sitemap.

```yaml
name: Check site for broken links
on:
  schedule:
    - cron: "0 0 * * 0"
    # every Sunday at midnight
    # see https://crontab.guru/#0_0_*_*_0
jobs:
  check-site-for-broken-links:
    runs-on: ubuntu-latest
    steps:
      - uses: harrisonpim/broken-link-checker
        with:
          sitemap: https://harrisonpim.com/sitemap.xml"
```
