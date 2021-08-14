import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeSelectInputModule } from 'mat-tree-select-input';
import { materials } from './angular-material';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTreeSelectInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ...materials
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
