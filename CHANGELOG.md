# Changelog

All notable changes to `mat-tree-select-input` are documented here.
The project follows [Semantic Versioning](https://semver.org/).

## [2.1.0] - Unreleased

### Added
- **Standalone components.** `MatTreeSelectInputComponent` and `MatTreeSelectInputNgmodelComponent` can be imported directly into standalone components. `MatTreeSelectInputModule` still works for NgModule apps.
- **Built-in search.** Set `[searchable]="true"` to show a search box in the dropdown. New inputs: `searchable`, `searchPlaceholder`, `noResultsText` and `filterPredicate`. Selections are kept while they are hidden by a search.
- `TreeFilterPredicate` type and `defaultTreeFilterPredicate` are exported.
- Support for Angular and Angular Material 19, 20, 21 and 22.
- Package metadata: MIT license, repository and issue tracker links, and better npm keywords.

### Fixed
- Removed the "Tree is using conflicting node types" warning that was logged in development mode. Leaf and parent nodes now use the same node type, with no visual change.

### Changed
- Templates use Angular's built-in control flow (`@if`) instead of `*ngIf`.
- `@angular/forms`, `@angular/cdk` and `rxjs` are now declared as peer dependencies. They were already required through Angular Material, so existing apps need no changes.

### Upgrade notes
- No changes are needed for apps that import `MatTreeSelectInputModule`.
- If your tests list a library component under `declarations`, move it to `imports`, because the components are now standalone.

## [2.0.0] - 2024-12-09

### Changed
- Upgraded to Angular and Angular Material 19.

## [1.2.0] - 2023-03-03

See the [git history](https://github.com/muhdszakari6/mat-tree-select/commits/main) for changes in this release.

## [1.1.0] - 2021-08-27

See the [git history](https://github.com/muhdszakari6/mat-tree-select/commits/main) for changes in this release.

## [1.0.0] - 2021-08-14

- First release.

[2.1.0]: https://github.com/muhdszakari6/mat-tree-select/compare/6fe4278...HEAD
[2.0.0]: https://www.npmjs.com/package/mat-tree-select-input/v/2.0.0
[1.2.0]: https://www.npmjs.com/package/mat-tree-select-input/v/1.2.0
[1.1.0]: https://www.npmjs.com/package/mat-tree-select-input/v/1.1.0
[1.0.0]: https://www.npmjs.com/package/mat-tree-select-input/v/1.0.0
