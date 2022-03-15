# 🔗 Broken link checker

This action takes a sitemap as input, and checks each of its URLs for broken links.

## Inputs

- `sitemap`: **Required** The URL of the sitemap to crawl.

## Outputs

If no broken links are found, the action passes silently. If any links are broken, the action will fail with:

- `broken-links`: A list of broken links, with the page they were found on.

## Example usage

Copy the following into a file called `.github/workflows/broken-links.yml`, and remember to edit the `sitemap` input to point to your own sitemap.

```yaml
name: Check site for broken links
on:
  schedule:
    - cron: "0 0 * * 0"
    # every Sunday at midnight
    # see https://crontab.guru/#0_0_*_*_0
  workflow_dispatch: 
    # see https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/ for documentation
    inputs: 
      logLevel: 
        default: warning
        description: "Log level"
        required: true
      tags: 
       description: 'Run manually'
jobs:
  check-site-for-broken-links:
    runs-on: ubuntu-latest
    steps:
      - uses: harrisonpim/broken-link-checker@0.1.2
        with:
          sitemap: https://harrisonpim.com/sitemap.xml
```
This yml file contains a section (workflow_dispatch) which allows the action to be run manually. To do this, after installing the action, 
navigate to actions, choose this action and then look for the run workflow button and follow the steps. 
