import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { of as observableOf } from 'rxjs';
import { TreeData } from '../mat-tree-select-input/mat-tree-select-input.component';
import { defaultTreeFilterPredicate, focusSearchInput, handleSearchKeydown, TreeFilterPredicate, TreeSearch } from '../../tree-search';

@Component({
    selector: 'ngx-mat-tree-select-input-ngmodel',
    templateUrl: './mat-tree-select-input-ngmodel.component.html',
    styleUrls: ['./mat-tree-select-input-ngmodel.component.css'],
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        FormsModule
    ]
})
export class MatTreeSelectInputNgmodelComponent implements OnInit, OnChanges {


  @Input() select = ""
  @Output() selectChange = new EventEmitter<string>();
  @Output() selectionChanged = new EventEmitter<string>();
  @Input() options: TreeData[] = []
  @Input() placeholder = ''
  @Input() multiple = false
  @Input() heading = ""
  @Input() canSelectParentNode = true
  @Input() searchable = false
  @Input() searchPlaceholder = 'Search'
  @Input() noResultsText = 'No results found'
  @Input() filterPredicate: TreeFilterPredicate = defaultTreeFilterPredicate

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  search = new TreeSearch();
  onSearchKeydown = handleSearchKeydown;

  constructor() {

    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);

    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit(): void {

    this.nestedDataSource.data = this.options

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.options?.currentValue !== changes.options?.previousValue) {
      this.nestedDataSource.data = this.options
    }

    if (changes.options || changes.filterPredicate) {
      this.onSearch(this.search.term)
    }

  }

  onSearch(term: string): void {
    this.search.update(this.options, term, this.filterPredicate)
  }

  onOpenedChange(open: boolean): void {
    if (!this.searchable) {
      return
    }
    if (open) {
      focusSearchInput(this.searchInput?.nativeElement)
    } else {
      this.onSearch('')
    }
  }

  isExpanded(node: TreeData): boolean {
    return this.nestedTreeControl.isExpanded(node) || this.search.isExpandedBySearch(node)
  }

  private _getChildren = (node: TreeData) => observableOf(node.children);

  hasNestedChild = (_: number, nodeData: TreeData) => {
    return (nodeData.children?.length > 0);
  }

}
