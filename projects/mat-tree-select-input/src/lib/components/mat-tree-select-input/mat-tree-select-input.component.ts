import { NestedTreeControl } from '@angular/cdk/tree';
import { OnChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';


export interface TreeData {

  name: string
  value: string
  children: TreeData[]

}

@Component({
    selector: 'ngx-mat-tree-select-input',
    templateUrl: './mat-tree-select-input.component.html',
    styleUrls: ['./mat-tree-select-input.component.css'],
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective
        }
    ],
    standalone: false
})
export class MatTreeSelectInputComponent implements OnInit, OnChanges {

  @Input() controlName: any = {};
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
