import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatTreeSelectInputComponent, TreeData } from './mat-tree-select-input.component';
import { MatTreeSelectInputModule } from '../../modules/mat-tree-select-input.module';
import { defaultTreeFilterPredicate, TreeFilterPredicate } from '../../tree-search';

const TREE: TreeData[] = [
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

@Component({
  template: `
    <form [formGroup]="form">
      <ngx-mat-tree-select-input
        [options]="options"
        [multiple]="multiple"
        [canSelectParentNode]="canSelectParentNode"
        [controlName]="'category'"
        [placeholder]="'Select category'">
      </ngx-mat-tree-select-input>
    </form>
  `,
  imports: [ReactiveFormsModule, MatTreeSelectInputComponent]
})
class StandaloneHostComponent {
  form = new FormGroup({ category: new FormControl<TreeData | TreeData[] | null>(null) });
  options = TREE;
  multiple = false;
  canSelectParentNode = true;
}

@Component({
  template: `
    <form [formGroup]="form">
      <ngx-mat-tree-select-input [options]="options" [controlName]="'category'"></ngx-mat-tree-select-input>
    </form>
  `,
  standalone: false
})
class NgModuleHostComponent {
  form = new FormGroup({ category: new FormControl<TreeData | null>(null) });
  options = TREE;
}

@Component({
  template: `
    <form [formGroup]="form">
      <ngx-mat-tree-select-input
        [options]="options"
        [multiple]="multiple"
        [searchable]="searchable"
        [filterPredicate]="filterPredicate"
        [noResultsText]="'Nothing here'"
        [controlName]="'category'">
        <span class="projected">Custom content</span>
      </ngx-mat-tree-select-input>
    </form>
  `,
  imports: [ReactiveFormsModule, MatTreeSelectInputComponent]
})
class SearchHostComponent {
  form = new FormGroup({ category: new FormControl<TreeData | TreeData[] | null>(null) });
  options = TREE;
  multiple = false;
  searchable = true;
  filterPredicate: TreeFilterPredicate = defaultTreeFilterPredicate;
}

/**
 * Detects changes and waits for async rendering, so tests pass with and without zone.js
 * (TestBed is zoneless by default from Angular 21). Two passes, each yielding a macrotask,
 * let ngModel's async write and mat-select's option sync settle.
 */
async function stabilize(fixture: ComponentFixture<unknown>): Promise<void> {
  for (let i = 0; i < 2; i++) {
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise(resolve => setTimeout(resolve));
  }
}

async function openSelect(fixture: ComponentFixture<unknown>): Promise<void> {
  await stabilize(fixture);
  const trigger: HTMLElement = fixture.nativeElement.querySelector('.mat-mdc-select-trigger');
  trigger.click();
  await stabilize(fixture);
}

function getOption(overlay: HTMLElement, name: string): HTMLElement {
  const option = Array.from(overlay.querySelectorAll<HTMLElement>('mat-option'))
    .find(el => el.textContent?.trim() === name);
  if (!option) {
    throw new Error(`Option "${name}" not found`);
  }
  return option;
}

function isVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

function visibleOptionNames(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>('mat-option'))
    .filter(isVisible)
    .map(el => el.textContent!.trim());
}

async function typeSearch(fixture: ComponentFixture<unknown>, root: HTMLElement, term: string): Promise<void> {
  const input = root.querySelector<HTMLInputElement>('.search-input')!;
  input.value = term;
  input.dispatchEvent(new Event('input'));
  await stabilize(fixture);
}

describe('MatTreeSelectInputComponent', () => {
  let overlay: HTMLElement;

  describe('standalone with reactive forms', () => {
    let fixture: ComponentFixture<StandaloneHostComponent>;
    let host: StandaloneHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StandaloneHostComponent, NoopAnimationsModule]
      }).compileComponents();

      fixture = TestBed.createComponent(StandaloneHostComponent);
      host = fixture.componentInstance;
      // Material 21+ renders the panel as a native popover instead of inside the OverlayContainer.
      overlay = document.body;
    });

    it('should create', async () => {
      await stabilize(fixture);
      const component = fixture.debugElement.children[0].children[0].componentInstance;
      expect(component).toEqual(jasmine.any(MatTreeSelectInputComponent));
    });

    it('renders every node of the tree as an option', async () => {
      await stabilize(fixture);
      await openSelect(fixture);

      const names = Array.from(overlay.querySelectorAll('mat-option')).map(el => el.textContent?.trim());
      expect(names).toEqual(['Electronics', 'Phones', 'Laptops', 'Books']);
    });

    it('does not mix flat and nested tree nodes', async () => {
      const warn = spyOn(console, 'warn').and.callThrough();
      await openSelect(fixture);

      expect(overlay.querySelectorAll('mat-tree-node').length).toBe(0);
      expect(warn).not.toHaveBeenCalledWith(jasmine.stringContaining('conflicting node types'));
    });

    it('writes the selected node to the form control', async () => {
      await stabilize(fixture);
      await openSelect(fixture);

      getOption(overlay, 'Phones').click();
      await stabilize(fixture);

      expect(host.form.value.category).toBe(TREE[0].children[0]);
    });

    it('reflects a value set on the form control', async () => {
      await stabilize(fixture);
      host.form.controls.category.setValue(TREE[1]);
      await stabilize(fixture);

      const valueText: HTMLElement = fixture.nativeElement.querySelector('.mat-mdc-select-value');
      expect(valueText.textContent?.trim()).toBe('Books');
    });

    it('supports multiple selection', async () => {
      host.multiple = true;
      await stabilize(fixture);
      await openSelect(fixture);

      getOption(overlay, 'Phones').click();
      getOption(overlay, 'Books').click();
      await stabilize(fixture);

      expect(host.form.value.category).toEqual(jasmine.arrayWithExactContents([TREE[0].children[0], TREE[1]]));
    });

    it('disables parent nodes when canSelectParentNode is false', async () => {
      host.canSelectParentNode = false;
      await stabilize(fixture);
      await openSelect(fixture);

      const parent = getOption(overlay, 'Electronics');
      expect(parent.getAttribute('aria-disabled')).toBe('true');

      parent.click();
      await stabilize(fixture);
      expect(host.form.value.category).toBeNull();

      getOption(overlay, 'Laptops').click();
      await stabilize(fixture);
      expect(host.form.value.category).toBe(TREE[0].children[1]);
    });

    it('keeps leaf nodes selectable when canSelectParentNode is false', async () => {
      host.canSelectParentNode = false;
      await stabilize(fixture);
      await openSelect(fixture);

      expect(getOption(overlay, 'Books').getAttribute('aria-disabled')).toBe('false');
    });

    it('updates the options when the input changes', async () => {
      await stabilize(fixture);
      host.options = [{ name: 'Toys', value: 'toys', children: [] }];
      await stabilize(fixture);
      await openSelect(fixture);

      const names = Array.from(overlay.querySelectorAll('mat-option')).map(el => el.textContent?.trim());
      expect(names).toEqual(['Toys']);
    });
  });

  describe('via MatTreeSelectInputModule (NgModule)', () => {
    it('can be used through the NgModule', async () => {
      await TestBed.configureTestingModule({
        declarations: [NgModuleHostComponent],
        imports: [ReactiveFormsModule, MatTreeSelectInputModule, NoopAnimationsModule]
      }).compileComponents();

      const fixture = TestBed.createComponent(NgModuleHostComponent);
      await stabilize(fixture);
      overlay = document.body;
      await openSelect(fixture);

      getOption(overlay, 'Books').click();
      await stabilize(fixture);

      expect(fixture.componentInstance.form.value.category).toBe(TREE[1]);
    });
  });
  describe('built-in search', () => {
    let fixture: ComponentFixture<SearchHostComponent>;
    let host: SearchHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SearchHostComponent, NoopAnimationsModule]
      }).compileComponents();

      fixture = TestBed.createComponent(SearchHostComponent);
      host = fixture.componentInstance;
      overlay = document.body;
    });

    it('does not render a search input unless searchable is set', async () => {
      host.searchable = false;
      await openSelect(fixture);

      expect(overlay.querySelector('.search-input')).toBeNull();
    });

    it('renders a search input when searchable is set', async () => {
      await openSelect(fixture);

      expect(overlay.querySelector('.search-input')).not.toBeNull();
    });

    it('focuses the search input when the panel opens', async () => {
      await openSelect(fixture);

      expect(document.activeElement).toBe(overlay.querySelector('.search-input'));
    });

    it('shows matches with their ancestors and expands the ancestors', async () => {
      await openSelect(fixture);
      await typeSearch(fixture, overlay, 'pho');

      expect(visibleOptionNames(overlay)).toEqual(['Electronics', 'Phones']);
    });

    it('matches case-insensitively anywhere in the name', async () => {
      await openSelect(fixture);
      await typeSearch(fixture, overlay, 'OOK');

      expect(visibleOptionNames(overlay)).toEqual(['Books']);
    });

    it('keeps the children of a matching parent available', async () => {
      await openSelect(fixture);
      await typeSearch(fixture, overlay, 'electronics');

      expect(visibleOptionNames(overlay)).toEqual(['Electronics']);
      overlay.querySelector<HTMLElement>('.tree-toggle')!.click();
      await stabilize(fixture);
      expect(visibleOptionNames(overlay)).toEqual(['Electronics', 'Phones', 'Laptops']);
    });

    it('shows the no-results text when nothing matches', async () => {
      await openSelect(fixture);
      expect(overlay.querySelector('.no-results')).toBeNull();

      await typeSearch(fixture, overlay, 'zzz');

      expect(visibleOptionNames(overlay)).toEqual([]);
      expect(overlay.querySelector('.no-results')?.textContent?.trim()).toBe('Nothing here');
    });

    it('selects a filtered option', async () => {
      await openSelect(fixture);
      await typeSearch(fixture, overlay, 'lap');

      getOption(overlay, 'Laptops').click();
      await stabilize(fixture);

      expect(host.form.value.category).toBe(TREE[0].children[1]);
    });

    it('keeps earlier selections that are hidden by the search (multiple)', async () => {
      host.multiple = true;
      await openSelect(fixture);

      getOption(overlay, 'Phones').click();
      await stabilize(fixture);
      await typeSearch(fixture, overlay, 'books');
      getOption(overlay, 'Books').click();
      await stabilize(fixture);

      expect(host.form.value.category).toEqual(jasmine.arrayWithExactContents([TREE[0].children[0], TREE[1]]));
    });

    it('does not let typed keys reach mat-select', async () => {
      await openSelect(fixture);
      const input = overlay.querySelector<HTMLInputElement>('.search-input')!;

      // mat-select reads the legacy keyCode, which synthetic KeyboardEvents leave at 0.
      const keys: [string, number][] = [['ArrowDown', 40], [' ', 32], ['Enter', 13], ['b', 66]];
      for (const [key, keyCode] of keys) {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        Object.defineProperty(event, 'keyCode', { get: () => keyCode });
        input.dispatchEvent(event);
        expect(event.defaultPrevented).withContext(key).toBeFalse();
      }
      await stabilize(fixture);

      expect(host.form.value.category).toBeNull();
    });

    it('clears the search when the panel closes', async () => {
      await openSelect(fixture);
      await typeSearch(fixture, overlay, 'pho');

      getOption(overlay, 'Phones').click();
      await stabilize(fixture);
      await openSelect(fixture);

      expect(overlay.querySelector<HTMLInputElement>('.search-input')!.value).toBe('');
      expect(visibleOptionNames(overlay)).toEqual(['Electronics', 'Books']);
    });

    it('supports a custom filterPredicate', async () => {
      host.filterPredicate = (node, term) => node.value === term;
      await openSelect(fixture);
      await typeSearch(fixture, overlay, 'laptops');

      expect(visibleOptionNames(overlay)).toEqual(['Electronics', 'Laptops']);
    });

    it('still renders projected content for custom filters', async () => {
      await openSelect(fixture);

      expect(overlay.querySelector('.projected')?.textContent).toBe('Custom content');
    });
  });
});
