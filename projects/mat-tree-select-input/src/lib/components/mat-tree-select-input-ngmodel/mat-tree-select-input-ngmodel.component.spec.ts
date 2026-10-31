import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatTreeSelectInputNgmodelComponent } from './mat-tree-select-input-ngmodel.component';
import { TreeData } from '../mat-tree-select-input/mat-tree-select-input.component';

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
    <ngx-mat-tree-select-input-ngmodel
      [options]="options"
      [multiple]="multiple"
      [canSelectParentNode]="canSelectParentNode"
      [placeholder]="'Select category'"
      [searchable]="searchable"
      [(select)]="value"
      (selectionChanged)="selectionChanged = $event">
    </ngx-mat-tree-select-input-ngmodel>
  `,
  imports: [MatTreeSelectInputNgmodelComponent]
})
class HostComponent {
  options = TREE;
  multiple = false;
  canSelectParentNode = true;
  searchable = false;
  value: any = '';
  selectionChanged: any;
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

describe('MatTreeSelectInputNgmodelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let overlay: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    // Material 21+ renders the panel as a native popover instead of inside the OverlayContainer.
    overlay = document.body;
  });

  it('should create', async () => {
    await stabilize(fixture);
    const component = fixture.debugElement.children[0].componentInstance;
    expect(component).toEqual(jasmine.any(MatTreeSelectInputNgmodelComponent));
  });

  it('updates the two-way [(select)] binding and emits selectionChanged', async () => {
    await stabilize(fixture);
    await openSelect(fixture);

    getOption(overlay, 'Phones').click();
    await stabilize(fixture);

    expect(host.value).toBe(TREE[0].children[0]);
    expect(host.selectionChanged).toBe(TREE[0].children[0]);
  });

  it('reflects a value set by the parent', async () => {
    host.value = TREE[1];
    await stabilize(fixture);

    const valueText: HTMLElement = fixture.nativeElement.querySelector('.mat-mdc-select-value');
    expect(valueText.textContent?.trim()).toBe('Books');
  });

  it('supports multiple selection', async () => {
    host.multiple = true;
    host.value = [];
    await stabilize(fixture);
    await openSelect(fixture);

    getOption(overlay, 'Phones').click();
    getOption(overlay, 'Books').click();
    await stabilize(fixture);

    expect(host.value).toEqual(jasmine.arrayWithExactContents([TREE[0].children[0], TREE[1]]));
  });

  it('disables parent nodes when canSelectParentNode is false', async () => {
    host.canSelectParentNode = false;
    await stabilize(fixture);
    await openSelect(fixture);

    const parent = getOption(overlay, 'Electronics');
    expect(parent.getAttribute('aria-disabled')).toBe('true');

    parent.click();
    await stabilize(fixture);
    expect(host.value).toBe('');

    getOption(overlay, 'Laptops').click();
    await stabilize(fixture);
    expect(host.value).toBe(TREE[0].children[1]);
  });
  describe('built-in search', () => {
    beforeEach(() => {
      host.searchable = true;
    });

    it('filters the tree and selects a filtered option', async () => {
      await openSelect(fixture);
      const input = overlay.querySelector<HTMLInputElement>('.search-input')!;
      input.value = 'lap';
      input.dispatchEvent(new Event('input'));
      await stabilize(fixture);

      const visible = Array.from(overlay.querySelectorAll<HTMLElement>('mat-option'))
        .filter(el => el.getClientRects().length > 0)
        .map(el => el.textContent!.trim());
      expect(visible).toEqual(['Electronics', 'Laptops']);

      getOption(overlay, 'Laptops').click();
      await stabilize(fixture);
      expect(host.value).toBe(TREE[0].children[1]);
      expect(host.selectionChanged).toBe(TREE[0].children[1]);
    });

    it('keeps earlier selections that are hidden by the search (multiple)', async () => {
      host.multiple = true;
      host.value = [];
      await openSelect(fixture);

      getOption(overlay, 'Phones').click();
      await stabilize(fixture);
      const input = overlay.querySelector<HTMLInputElement>('.search-input')!;
      input.value = 'books';
      input.dispatchEvent(new Event('input'));
      await stabilize(fixture);
      getOption(overlay, 'Books').click();
      await stabilize(fixture);

      expect(host.value).toEqual(jasmine.arrayWithExactContents([TREE[0].children[0], TREE[1]]));
    });
  });
});
