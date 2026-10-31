import { NgModule } from '@angular/core';
import { MatTreeSelectInputComponent } from '../components/mat-tree-select-input/mat-tree-select-input.component';
import { MatTreeSelectInputNgmodelComponent } from '../components/mat-tree-select-input-ngmodel/mat-tree-select-input-ngmodel.component';

/**
 * Kept for backward compatibility with NgModule-based apps.
 * Standalone apps can import the components directly.
 */
@NgModule({
  imports: [
    MatTreeSelectInputComponent,
    MatTreeSelectInputNgmodelComponent
  ],
  exports: [
    MatTreeSelectInputComponent,
    MatTreeSelectInputNgmodelComponent
  ]
})
export class MatTreeSelectInputModule { }
