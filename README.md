<p align="center">
  <a href="https://github.com/capkakitiga/action-turbo-affected/actions"><img alt="typescript-action status" src="https://github.com/capkakitiga/action-turbo-affected/workflows/build-test/badge.svg"></a>
</p>

# `turbo-affected` Github Action

A Github Action making it easy to check affected workspaces using [Turborepo](https://turbo.build/).

## Prerequisites

Since this Github Action relies on Turborepo, you'll need to have Turborepo set up in your repository before using this. Also, this action relies on the fact that you have a `build` pipeline configured as it makes use of `turbo run build --dry-run` behind the scenes.

:warning: This was tested against a working monorepo using Yarn v3 (with Yarn Workspaces), but as it uses a standard Turborepo command behind the scenes, it should work with any monorepo setup compatible with Turborepo. See the `example/yarn-workspaces` folder for a working setup.

## How to use

Here is a minimal example of how to use the action to get the affected list:

```yaml
name: 'example-push'
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Necessary so we have commit history to compare to

      - name: package-a changed in last commit?
        id: affectedWorkspaces
        uses: capkakitiga/action-turbo-affected@v1
        with:
          from: HEAD^1 # Check for changes since previous commit (feel free to put a branch name instead in the form of origin/<branchName>)

      # Do something more meaningful here, like push to NPM, do heavy computing, etc.
      - name: Validate Action Output
        if: steps.changedAction.outputs.changed == 'true' # Check output if it changed or not (returns a boolean)
        run: echo 'package-a changed!'
```

> :information_source: Feel free to check the [`example_push.yml`](./.github/workflows/example-push.yml) and [`example-pull_request.yml`](./.github/workflows/example-pull_request.yml) files as well for more examples.

### Options

The following options can be passed to customize the behavior of the action:

| Option Name         | Description                                                                                          | Default Value |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| `from`              | **(Required)** Start of the commit range to check (can be a commit hash, a branch name or `HEAD^1`). | NA            |
| `to`                | End of the commit range to check (can be a commit hash or branch).                                   | `HEAD`        |
| `working-directory` | Path to the root of the monorepo.                                                                    | `./`          |

_:information_source: If using branch names, be sure to specify them as `origin/<branchName>`, as otherwise you'll be comparing to a local branch, which in most cases won't exist._

## How it works?

Behind the scenes, this will run a Turborepo command looking like this to get the changed repositories:

```bash
yarn turbo run build --filter="[<from>...<to>]" --dry-run=json
```

The action then parses the returned JSON list of the affected workspaces.

## Disclaimer

This project was bootstraped using [typescript-action](https://github.com/actions/typescript-action).
