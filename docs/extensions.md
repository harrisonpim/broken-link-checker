# Extending the default behavior

## Manually checking for broken links via github actions

To set up a version of the action which can be manually triggered instead of running on a schedule, edit your `.github/workflows/broken-links.yml` file to match the following pattern:

```yaml
name: Check site for broken links
on:
  workflow_dispatch: 
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

See the [manual triggers workflow dispatch documentation here](https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/) for more information.

## Running the code locally

The action can also be run locally as a script. After [setting up a local development version of the codebase](./developing.md), run:

```sh
yarn main --sitemap=https://example.com/sitemap.xml --allowList='["https://example.com/blog"]'
```

changing the `sitemap` and `allowList` parameters as needed.
