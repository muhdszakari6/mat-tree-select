import { NgModule } from '@angular/core';
import { MatTreeSelectInputComponent } from './mat-tree-select-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTreeSelectInputNgmodelComponent } from './mat-tree-select-input-ngmodel/mat-tree-select-input-ngmodel.component';






@NgModule({
  declarations: [
    MatTreeSelectInputComponent,
    MatTreeSelectInputNgmodelComponent
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTreeModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule


  ],
  exports: [
    MatTreeSelectInputComponent,
    MatTreeSelectInputNgmodelComponent

  ]
})
export class MatTreeSelectInputModule { }
