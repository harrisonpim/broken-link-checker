# 🔗 Broken link checker

This action takes a sitemap as input, and checks each of its URLs for broken links.

## Inputs

- `sitemap`: **Required** The URL of the sitemap to crawl.
- `allowList`: **Optional** A list of URLs to ignore. Should be formatted as a JSON array, eg `["https://example.com/", "https://example.com/blog"]`.

## Outputs

If no broken links are found, the action passes silently. If any links are broken, the action will fail with:

- `broken-links`: A list of broken links, with the page where they were found.

## Example usage

Copy the following into a file called `.github/workflows/broken-links.yml` in your repo, and remember to edit the `sitemap` input to point to your own sitemap.

```yaml
name: Check site for broken links
on:
  schedule:
    - cron: "0 0 * * 0"
    # Runs every Sunday at midnight
    # see https://crontab.guru/#0_0_*_*_0
jobs:
  check-site-for-broken-links:
    runs-on: ubuntu-latest
    steps:
      - uses: harrisonpim/broken-link-checker@0.2.1
        with:
          sitemap: https://harrisonpim.com/sitemap.xml
```

## Further information

See the [broken-link-checker documentation](./docs/) for more information.
