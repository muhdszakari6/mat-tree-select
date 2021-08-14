import { NestedTreeControl } from '@angular/cdk/tree';
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
  template: `
   
   <mat-form-field appearance="outline">
        <mat-select [id]="controlName"  [placeholder]="placeholder" [multiple] = "multiple" [formControlName]="controlName">
            <mat-tree class="example-tree mat-tree-position" [dataSource]="nestedDataSource" [treeControl]="nestedTreeControl">
                <!-- This is the tree node template for leaf nodes -->
                <mat-tree-node  class="mat-tree-node"  *matTreeNodeDef="let node" >
                  <mat-option [value]="node">
                    <!-- use a disabled button to provide padding for tree leaf -->
                    <p style="margin-left: 35px;" class="tree_text">  {{node.name}} </p>
                  </mat-option>
                </mat-tree-node>
                <!-- This is the tree node template for expandable nodes -->
                <!-- <mat-option> -->
                  <mat-nested-tree-node    *matTreeNodeDef="let node; when: hasNestedChild" >
                      <div style="display: flex" >
                      <button  class="tree-toggle" mat-icon-button matTreeNodeToggle
                      [attr.aria-label]="'toggle ' + node.name" >
                <mat-icon class="mat-icon-rtl-mirror">
                  {{nestedTreeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
                </mat-icon>
              </button>
              <mat-option  style="display: flex;" class="mat-tree-node" [value]="node">

                      {{node.name}}
                    </mat-option>

                    </div>

                    <ul [class.example-tree-invisible]="!nestedTreeControl.isExpanded(node)">
                      <p class="title">Children of {{node.name}}</p>
                      <ng-container matTreeNodeOutlet></ng-container>
                    </ul>
          
                  </mat-nested-tree-node>
                <!-- </mat-option> -->
              </mat-tree>

        </mat-select>


    </mat-form-field>

    
  `,
  styles: [`.example-tree-invisible {
    display: none;
}
.example-tree ul, .example-tree li {
    margin-top: 0;
    margin-bottom: 0;
    list-style-type: none;
}
.mat-tree {
    width: 100%;
    margin-top: 15px;
    box-sizing: border-box;
}
.mat-tree button {
    height: 33px;
    width: 33px;
    line-height: 33px;
    color: #777;
    margin-left: 0px;
    margin-right: 0px;
}
.mattreenodetoggle {
    color: #777;
}
.mat-tree-node {
    display: flex;
    align-items: center;
    font-size: 12px;
    min-height: 0;
    position: relative;
}
:host ::ng-deep .mat-option-text {
    display: flex !important;
    align-items: center;
    font-size: 12px;
    min-height: 0;
    position: relative;
}
.actions {
    display: flex;
    align-items: center;
    margin-left: 30px;
}
.tree-toggle {
    position: relative;
}
.title {
    margin-right: auto;
    margin-bottom: 0;
    font-weight: 500;
    color: #777;
    align-self: flex-end;
    font-size: 12px;
    margin-left: 20px;
    padding-top: 10px;
}
.tree_text {
    margin-bottom: 0;
    width: 100px;
    line-height: normal;
}
ul {
    padding: 0px;
    margin-bottom: 10px !important;
    margin-left: 51px;
}
mat-tree-node {
    position: relative;
}
mat-tree-node::after {
    content: '';
    position: absolute;
    left: 0;
    height: 1px;
    width: 40px;
}
`],

  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class MatTreeSelectInputComponent implements OnInit {

  @Input() controlName: any = {};
  @Input() options: TreeData[]  = []
  @Input() placeholder = ''
  @Input() multiple = false


  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;

  constructor() { 
    
    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);

    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit(): void {

    this.nestedDataSource.data = this.options
  }
  private _getChildren = (node: TreeData) => observableOf(node.children);

  hasNestedChild = (_: number, nodeData: TreeData) => {
    return (nodeData.children?.length > 0);
  }



}
