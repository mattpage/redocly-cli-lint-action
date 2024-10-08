# Redocly OpenAPI Lint Action

This actions uses [redocly/openapi-cli](https://github.com/Redocly/openapi-cli) to lint OpenAPI documents in a repository.
It now supports OAS 3.1.

## Usage

See [action.yml](https://github.com/mattpage/redocly-cli-lint-action/blob/main/action.yml).

```yaml
name: OpenAPI Lint

on:
  - push

jobs:
  build:
    name: OpenAPI Lint
    runs-on: ubuntu-latest
    steps:
      # Check out the repository
      - uses: actions/checkout@v2

      # Run Redocly Lint
      - uses: mattpage/redocly-cli-lint-action@v0.0.1
        with:
          entrypoints: 'documents/openapi.yaml'
          config: '.redocly.yml'
```

## TODO

  - [ ] GitHub Checks Annotations
  - [ ] Rule exceptions
