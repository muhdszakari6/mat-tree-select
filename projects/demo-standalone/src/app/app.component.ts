import { Component, VERSION } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatTreeSelectInputComponent,
  MatTreeSelectInputNgmodelComponent,
  TreeData
} from 'mat-tree-select-input';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe, MatTreeSelectInputComponent, MatTreeSelectInputNgmodelComponent],
  template: `
    <h1>mat-tree-select-input – standalone demo</h1>
    <p id="ng-version">Angular {{ version }}</p>

    <form [formGroup]="form">
      <section id="reactive">
        <h2>Reactive forms</h2>
        <ngx-mat-tree-select-input [options]="options" [controlName]="'category'"
          [placeholder]="'Select category'" [heading]="'Subcategory of'">
        </ngx-mat-tree-select-input>
        <pre class="result">{{ form.value.category | json }}</pre>
      </section>

      <section id="reactive-multiple">
        <h2>Reactive forms – multiple</h2>
        <ngx-mat-tree-select-input [options]="options" [controlName]="'categories'" [multiple]="true"
          [placeholder]="'Select categories'">
        </ngx-mat-tree-select-input>
        <pre class="result">{{ form.value.categories | json }}</pre>
      </section>

      <section id="reactive-no-parent">
        <h2>Reactive forms – canSelectParentNode = false</h2>
        <ngx-mat-tree-select-input [options]="options" [controlName]="'leafOnly'" [canSelectParentNode]="false"
          [placeholder]="'Select a leaf'">
        </ngx-mat-tree-select-input>
        <pre class="result">{{ form.value.leafOnly | json }}</pre>
      </section>

      <section id="search">
        <h2>Built-in search</h2>
        <ngx-mat-tree-select-input [options]="options" [controlName]="'searched'" [searchable]="true"
          [placeholder]="'Search and select'" [searchPlaceholder]="'Type to filter…'">
        </ngx-mat-tree-select-input>
        <pre class="result">{{ form.value.searched | json }}</pre>
      </section>

      <section id="search-multiple">
        <h2>Built-in search – multiple</h2>
        <ngx-mat-tree-select-input [options]="options" [controlName]="'searchedMany'" [searchable]="true"
          [multiple]="true" [placeholder]="'Search and select several'">
        </ngx-mat-tree-select-input>
        <pre class="result">{{ form.value.searchedMany | json }}</pre>
      </section>
    </form>

    <section id="ngmodel">
      <h2>ngModel-style two-way binding</h2>
      <ngx-mat-tree-select-input-ngmodel [options]="options" [(select)]="selected"
        [placeholder]="'Select category'">
      </ngx-mat-tree-select-input-ngmodel>
      <pre class="result">{{ selected | json }}</pre>
    </section>

    <section id="ngmodel-search">
      <h2>ngModel-style binding with search</h2>
      <ngx-mat-tree-select-input-ngmodel [options]="options" [(select)]="searchedNgModel" [searchable]="true"
        [placeholder]="'Search and select'">
      </ngx-mat-tree-select-input-ngmodel>
      <pre class="result">{{ searchedNgModel | json }}</pre>
    </section>
  `,
  styles: [`
    :host { display: block; max-width: 640px; margin: 24px auto; font-family: Roboto, sans-serif; }
    section { margin-bottom: 24px; }
    .result { background: #f5f5f5; padding: 8px; min-height: 1em; }
  `]
})
export class AppComponent {
  version = VERSION.full;

  options: TreeData[] = [
    {
      name: 'Electronics',
      value: 'electronics',
      children: [
        { name: 'Phones', value: 'phones', children: [] },
        { name: 'Laptops', value: 'laptops', children: [] }
      ]
    },
    {
      name: 'Web Development',
      value: 'web-development',
      children: [
        {
          name: 'Frontend',
          value: 'frontend',
          children: [
            { name: 'Angular', value: 'angular', children: [] },
            { name: 'React', value: 'react', children: [] }
          ]
        }
      ]
    },
    { name: 'Books', value: 'books', children: [] }
  ];

  form = new FormGroup({
    category: new FormControl<TreeData | null>(null),
    categories: new FormControl<TreeData[]>([]),
    leafOnly: new FormControl<TreeData | null>(null),
    searched: new FormControl<TreeData | null>(null),
    searchedMany: new FormControl<TreeData[]>([])
  });

  // `select` is typed as string in 2.x although it holds TreeData, so these use `any`.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  selected: any = '';
  searchedNgModel: any = '';
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
