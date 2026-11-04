# mat-tree-select-input

[![npm version](https://img.shields.io/npm/v/mat-tree-select-input.svg)](https://www.npmjs.com/package/mat-tree-select-input)
[![npm downloads](https://img.shields.io/npm/dm/mat-tree-select-input.svg)](https://www.npmjs.com/package/mat-tree-select-input)
[![CI](https://github.com/muhdszakari6/mat-tree-select/actions/workflows/ci.yml/badge.svg)](https://github.com/muhdszakari6/mat-tree-select/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/mat-tree-select-input.svg)](https://github.com/muhdszakari6/mat-tree-select/blob/main/LICENSE)

**A tree select for Angular Material: a `mat-select` form field whose options are a collapsible tree.**

<!-- TODO: replace with a GIF of searching and selecting in the dropdown -->
![mat-tree-select-input demo](https://res.cloudinary.com/muhdsalim/image/upload/v1631314473/Screenshot_148_innlac.png)

<!-- TODO: replace the link below with the StackBlitz project URL -->
[**Try it on StackBlitz**](https://stackblitz.com/) · [Live demo](https://mat-tree-select-input-demo.netlify.app/) · [Changelog](https://github.com/muhdszakari6/mat-tree-select/blob/main/CHANGELOG.md)

## Features

- Single or multiple selection
- Unlimited depth, with collapsible nodes
- Built-in search (`[searchable]="true"`), with custom matching if you need it
- Optionally make only leaf nodes selectable (`[canSelectParentNode]="false"`)
- Works with reactive forms and with `[(select)]` two-way binding
- Standalone components, plus an NgModule for existing apps
- Looks and behaves like `mat-select`, and uses your Angular Material theme

## Compatibility

| mat-tree-select-input | Angular & Angular Material |
|---|---|
| 2.1.x | 19, 20, 21, 22 |
| 2.0.x | 19 |

## Installation

`@angular/material` must already be set up in your app (`ng add @angular/material`).

```bash
npm install mat-tree-select-input
```

The expand/collapse arrows are Material icons, so make sure the Material Icons font is loaded (the Angular Material setup adds it to `index.html`):

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

## Quick start

### 1. Describe your tree

```typescript
import { TreeData } from 'mat-tree-select-input';

options: TreeData[] = [
  {
    name: 'Electronics',
    value: 'electronics',
    children: [
      { name: 'Phones', value: 'phones', children: [] },
      { name: 'Laptops', value: 'laptops', children: [] }
    ]
  },
  { name: 'Books', value: 'books', children: [] }
];
```

### 2a. Standalone components

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTreeSelectInputComponent, TreeData } from 'mat-tree-select-input';

@Component({
  selector: 'app-category-picker',
  imports: [ReactiveFormsModule, MatTreeSelectInputComponent],
  template: `
    <form [formGroup]="form">
      <ngx-mat-tree-select-input
        [options]="options"
        [controlName]="'category'"
        [placeholder]="'Select a category'"
        [searchable]="true">
      </ngx-mat-tree-select-input>
    </form>
  `
})
export class CategoryPickerComponent {
  options: TreeData[] = [/* ... */];
  form = new FormGroup({
    category: new FormControl<TreeData | null>(null)
  });
}
```

### 2b. NgModule

```typescript
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeSelectInputModule } from 'mat-tree-select-input';

@NgModule({
  declarations: [AppComponent],
  imports: [ReactiveFormsModule, MatTreeSelectInputModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

The templates are the same in both setups.

## Usage

### Reactive forms

`ngx-mat-tree-select-input` must be inside a `[formGroup]`. Pass the name of the form control to `controlName`.

```html
<form [formGroup]="form">
  <ngx-mat-tree-select-input
    [options]="options"
    [controlName]="'category'"
    [placeholder]="'Select a category'">
  </ngx-mat-tree-select-input>
</form>
```

Multiple selection: add `[multiple]="true"` and use an array control, e.g. `new FormControl<TreeData[]>([])`.

### Two-way binding

Use `ngx-mat-tree-select-input-ngmodel` when you don't have a form group:

```html
<ngx-mat-tree-select-input-ngmodel
  [options]="options"
  [(select)]="selectedCategory"
  (selectionChanged)="onCategoryChanged($event)"
  [placeholder]="'Select a category'">
</ngx-mat-tree-select-input-ngmodel>
```

### Only leaf nodes selectable

```html
<ngx-mat-tree-select-input
  [options]="options"
  [controlName]="'category'"
  [canSelectParentNode]="false">
</ngx-mat-tree-select-input>
```

Parent nodes are still shown and can be expanded, but can't be selected.

### Group headings

`heading` adds a label above each group of children, e.g. `[heading]="'Subcategory of'"` shows "Subcategory of Electronics" above Phones and Laptops.

## Search and filtering

### Built-in search

```html
<ngx-mat-tree-select-input
  [options]="options"
  [controlName]="'category'"
  [searchable]="true"
  [searchPlaceholder]="'Search categories'"
  [noResultsText]="'No matching categories'">
</ngx-mat-tree-select-input>
```

- A matching node is shown with its parents (expanded automatically) and its children.
- Selections are kept while they're hidden by a search, so in multiple mode you can search, pick, search again and pick more.
- The search box is focused when the dropdown opens and cleared when it closes.

By default a node matches when its `name` contains the search text, ignoring case. To match differently, pass a `filterPredicate`:

```typescript
import { TreeFilterPredicate } from 'mat-tree-select-input';

matchNameOrValue: TreeFilterPredicate = (node, term) => {
  const search = term.toLowerCase();
  return node.name.toLowerCase().includes(search) || node.value.toLowerCase().includes(search);
};
```

```html
<ngx-mat-tree-select-input [searchable]="true" [filterPredicate]="matchNameOrValue" ...>
</ngx-mat-tree-select-input>
```

### Custom filter input

For full control, put your own input inside the component; it's shown at the top of the dropdown. Stop `keydown` from propagating so typing doesn't trigger `mat-select`'s keyboard shortcuts:

```html
<ngx-mat-tree-select-input [options]="filteredOptions" [controlName]="'category'">
  <input #search placeholder="Search" (keydown)="$event.stopPropagation()"
    (input)="filter(search.value)">
</ngx-mat-tree-select-input>
```

```typescript
filteredOptions: TreeData[] = this.options;

filter(text: string): void {
  const search = text.toLowerCase();
  const keepMatches = (nodes: TreeData[]): TreeData[] =>
    nodes.reduce<TreeData[]>((result, node) => {
      if (node.name.toLowerCase().includes(search)) {
        result.push(node);
      } else {
        const children = keepMatches(node.children);
        if (children.length) {
          result.push({ ...node, children });
        }
      }
      return result;
    }, []);

  this.filteredOptions = search ? keepMatches(this.options) : this.options;
}
```

Because this replaces `options`, selected values that are filtered out can be dropped in multiple mode (this happens on Angular Material 19 to 21). The built-in search hides nodes instead of removing them, so it keeps selections on every supported version.

## API

### `ngx-mat-tree-select-input` (reactive forms)

| Input | Type | Default | Description |
|---|---|---|---|
| `options` | `TreeData[]` | `[]` | The tree to display. |
| `controlName` | `string` | — | Name of the control in the parent `[formGroup]`. |
| `placeholder` | `string` | `''` | Placeholder of the select. |
| `multiple` | `boolean` | `false` | Allow selecting several nodes. The value is then an array. |
| `canSelectParentNode` | `boolean` | `true` | When `false`, only leaf nodes can be selected. |
| `heading` | `string` | `''` | Label shown above each group of children, followed by the parent's name. |
| `searchable` | `boolean` | `false` | Show the built-in search box. |
| `searchPlaceholder` | `string` | `'Search'` | Placeholder and accessible label of the search box. |
| `noResultsText` | `string` | `'No results found'` | Shown when the search matches nothing. |
| `filterPredicate` | `TreeFilterPredicate` | name contains term (case-insensitive) | Decides whether a node matches the search. |

The selected value is written to the form control.

### `ngx-mat-tree-select-input-ngmodel` (two-way binding)

Has the same inputs except `controlName`, plus:

| Input / Output | Type | Description |
|---|---|---|
| `[(select)]` | `TreeData \| TreeData[]` | The selected node(s), two-way bindable. |
| `(selectionChanged)` | `EventEmitter` | Emits the selected node(s) when the user changes the selection. |

### Types

```typescript
interface TreeData {
  name: string;          // label shown in the dropdown
  value: string;         // your identifier for the node
  children: TreeData[];  // use [] for leaf nodes
}

type TreeFilterPredicate = (node: TreeData, term: string) => boolean;
```

Exports: `MatTreeSelectInputComponent`, `MatTreeSelectInputNgmodelComponent`, `MatTreeSelectInputModule`, `TreeData`, `TreeFilterPredicate`, `defaultTreeFilterPredicate`.

## FAQ

**What value do I get: the node or its `value`?**
The whole `TreeData` node (or an array of nodes in multiple mode), e.g. `{ name: 'Phones', value: 'phones', children: [] }`. Read `.value` if you only need the identifier.

**How do I pre-select a value?**
Set the control (or `select`) to a node object from the same `options` array you pass in. Selection is matched by object reference, so a new object with the same fields won't be recognised:

```typescript
this.form.controls.category.setValue(this.options[0].children[1]);
```

**Can I use it with `formGroupName` or a standalone `FormControl`?**
Not yet: `ngx-mat-tree-select-input` binds `controlName` to the top-level `[formGroup]`, so it doesn't work inside a `formGroupName` (nested group) or with a standalone `FormControl`. Use the two-way binding component if that doesn't fit your form.

**My data isn't shaped like `TreeData`. How do I convert it?**
Map it recursively:

```typescript
toTreeData(items: Category[]): TreeData[] {
  return items.map(item => ({
    name: item.title,
    value: String(item.id),
    children: this.toTreeData(item.subcategories ?? [])
  }));
}
```

**In what order are multiple selections returned?**
In `mat-select`'s internal option order, which isn't always the on-screen order: for example, selecting Phones (nested) and then Books (top level) returns `[Books, Phones]`. Sort the array yourself if order matters.

**How do I make the field wider?**
Add a global style, for example in `styles.css`:

```css
ngx-mat-tree-select-input .mat-mdc-form-field,
ngx-mat-tree-select-input-ngmodel .mat-mdc-form-field {
  width: 100%;
}
```

**The expand/collapse arrows show text such as `chevron_right`.**
The Material Icons font isn't loaded. Add the `<link>` from [Installation](#installation).

**Is it accessible?**
It is built on `mat-select` and `mat-option`, so it uses their ARIA roles and keyboard support. Known gap: the arrow keys don't move from the search box into the list yet. Issues and PRs are welcome.

## Contributing

Bug reports, ideas and pull requests are welcome. See [CONTRIBUTING.md](https://github.com/muhdszakari6/mat-tree-select/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/muhdszakari6/mat-tree-select/blob/main/LICENSE) © Salim Zakari
