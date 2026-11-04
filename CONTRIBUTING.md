# Contributing to mat-tree-select-input

Thanks for helping improve the library. Bug reports, feature ideas, documentation fixes and pull requests are all welcome.

## Reporting a bug

[Open an issue](https://github.com/muhdszakari6/mat-tree-select/issues) and include:

- the versions of `mat-tree-select-input`, Angular and Angular Material
- whether you use reactive forms or `[(select)]`, and standalone or NgModule
- a minimal `options` tree and template that reproduces the problem (a StackBlitz link is ideal)
- what you expected and what happened instead, including any console errors

## Project layout

| Path | What it is |
|---|---|
| `projects/mat-tree-select-input` | The library that is published to npm |
| `src` | Demo app that uses the NgModule |
| `projects/demo-standalone` | Demo app that uses the standalone components only |

Both demos import the library from `dist/`, the same way users get it from npm, so build the library before running them.

## Setup

You need Node.js 18.19+, 20.11+ or 22+, and Chrome for the unit tests.

```bash
git clone https://github.com/muhdszakari6/mat-tree-select.git
cd mat-tree-select
npm ci
npm run build
```

## Everyday commands

| Command | What it does |
|---|---|
| `npm run build` | Builds the library into `dist/mat-tree-select-input` |
| `npm run watch` | Rebuilds the library on every change |
| `npm start` | Runs the NgModule demo at http://localhost:4200 |
| `npm run start:standalone` | Runs the standalone demo (add `-- --port 4300` to run both) |
| `npm test` | Runs the unit tests in watch mode |
| `npm run test:ci` | Runs the unit tests once in headless Chrome |
| `npm run lint` | Lints the library and the demos |
| `npm run build:demos` | Builds both demo apps |

When working on the library, keep `npm run watch` running in one terminal and a demo in another.

## Supported Angular versions

The library is built with the **lowest** supported Angular version (currently 19), so the published package works in apps on 19 and every later supported version. Don't use Angular or Material APIs that were added after that version.

CI runs the tests and builds both demos on every supported major version (19 to 22). If you change the supported range, update:

- `peerDependencies` in `projects/mat-tree-select-input/package.json`
- the version matrix in `.github/workflows/ci.yml`
- the compatibility table in `README.md`

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Keep each pull request focused on one change.
3. Add or update unit tests for any behaviour change. Tests live next to the components (`*.spec.ts`).
4. Run `npm run lint`, `npm run test:ci` and `npm run build` before pushing.
5. Update `README.md` for user-facing changes and add an entry under "Unreleased" in `CHANGELOG.md`.
6. Describe what changed and why in the pull request, with screenshots for visual changes.

### Breaking changes

Avoid breaking changes where possible. If one is needed, say so clearly in the pull request; it will be released in a new major version with upgrade notes in the changelog.

## Releasing (maintainers)

Releases are published to npm by the [Release workflow](.github/workflows/release.yml) when a GitHub release is published. Pushing commits or tags never publishes.

1. Update the version in `projects/mat-tree-select-input/package.json` and move the "Unreleased" changelog entries under the new version and date. Merge this to `main`.
2. On GitHub, create a release from `main` with a new tag matching the version (e.g. `v2.1.0`) and paste in the changelog notes. Tick "Set as a pre-release" for versions like `2.2.0-beta.1`; they are published under the `next` dist-tag.
3. Publishing the release runs the full CI checks, then publishes the package CI built and tested. The workflow fails without publishing if the tag doesn't match the package version.

**One-time setup:** on npmjs.com, open the package's settings, go to *Trusted publishing*, and add a GitHub Actions publisher with repository `muhdszakari6/mat-tree-select` and workflow `release.yml`. No npm token is needed in the repository.

**Manual fallback:** `npm run build`, then `cd dist/mat-tree-select-input && npm publish`. Use `npm run build`, not `ng build`, so the README, LICENSE and CHANGELOG are included.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
