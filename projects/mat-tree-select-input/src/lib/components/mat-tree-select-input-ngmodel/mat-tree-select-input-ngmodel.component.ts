import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { of as observableOf } from 'rxjs';
import { TreeData } from '../mat-tree-select-input/mat-tree-select-input.component';

@Component({
    selector: 'ngx-mat-tree-select-input-ngmodel',
    templateUrl: './mat-tree-select-input-ngmodel.component.html',
    styleUrls: ['./mat-tree-select-input-ngmodel.component.css'],
    standalone: false
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


  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;

  constructor() {

    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);

    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit(): void {

    this.nestedDataSource.data = this.options

  }

  ngOnChanges(changes: any): void {

    if (changes.options?.currentValue !== changes.options?.previousValue) {
      this.nestedDataSource.data = this.options
    }

  }

  private _getChildren = (node: TreeData) => observableOf(node.children);

  hasNestedChild = (_: number, nodeData: TreeData) => {
    return (nodeData.children?.length > 0);
  }

}
