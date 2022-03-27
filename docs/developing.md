# Developing

## Getting Started

To install dependencies, run `yarn`.

## Running locally

To run the process locally, run:

```sh
yarn main --sitemap=https://example.com/sitemap.xml --allowList='["https://example.com/blog"]'
```

## Testing

Run `yarn test` to run the tests.

## Debugging

The scripts use the [debug](https://www.npmjs.com/package/debug) package to log messages.
Logs can be configured with the `DEBUG` environment variable. For example, to run the process with all debug logs, run:

```sh
DEBUG=* yarn main --sitemap=https://example.com/sitemap.xml --allowList='["https://example.com/blog"]'
```

The available log groups are:

- `index`: Logs the highest level information about the script's progress.
- `url`: Response status codes for each URL being checked.
- `fetch`: Whether the URL was fetched from the cache or not.

Core logs are also output by the github actions package, formatted accordingly. 
