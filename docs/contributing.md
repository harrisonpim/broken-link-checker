# Contributing

Contributions to the project are very welcome! Before proceeding, make sure you take a look at the project's [code of conduct](./code_of_conduct.md).

If you notice a bug or want to see a new feature in the package, [create a new issue](https://github.com/harrisonpim/broken-link-checker/issues/new) describing what's wrong in the current version.

If you can't make the change yourself, that's all you need to do!

If you can make the change, follow the instructions for setting up a local development version of the codebase and contributing changes.

## Setting up local development version

See [developing](./developing.md)

## Contributing changes

First, create a local feature branch for your change, with a descriptive name.

Make your changes locally, and commit them to your local branch.

When you're satisfied with your implementation of the changes, and [the tests are passing](#testing) push your local branch to github and create a new pull request. Write a short description of the fix, and link the PR to the original issue.

When the PR has been approved, you can merge it into the `main` branch and, if appropriate, [release a new version](#releasing) of the package.

### Testing

To run the tests locally, run

```sh
yarn test
```

Tests are also run automatically on every PR to the `main` branch.

## Releasing

New versions of the action are made available every time a new [release](https://github.com/harrisonpim/broken-link-checker/releases) is created.

To release a new version of the package, first compile the package from typescript to the `/dist` directory by running:

```sh
yarn all
```

Make sure the version number is appropriately bumped in `package.json` (using  [semantic versioning](https://semver.org/) principles), and push your changes to the `main` branch.

Then prepare a release via the `gh` cli or the [releases](https://github.com/harrisonpim/broken-link-checker/releases) page. See the [github docs](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) for further information on github releases.
