# Broken link checker

This action takes a sitemap as input, and checks each of its URLs for broken links.

## Inputs

## `sitemap`

**Required** The URL of the sitemap to crawl.

## Outputs

## `broken-links`

A list of broken links found, with the page they were found on.

## Example usage

```yaml
uses: harrisonpim/broken-link-checker
with:
  sitemap: https://harrisonpim.com/sitemap.xml
```
