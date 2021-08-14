import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeData } from 'mat-tree-select-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  category = ""
  form: FormGroup;
  feild = {
    type: 'text',
    name: 'custom',
    placeholder: 'Custom'
  }
  
  select_feild = {
    name: 'custom',
    placeholder: 'Custom'
  }
  
  options = [
    {
      text: 'Active',
      value: 'Active'
    },
    {
      text: 'Inactive',
      value: 'Inactive'
    }

  ]
  tree_options: TreeData[] = [
    {
      name: 'Parent',
      value: 'Parent',
      children: [
        {
          name: 'Child',
          value: 'Child',
          children: [
            {
              name: 'Child',
              value: 'Child', 
              children: []
              
            } 
          ]
        }
      ]
    },
   
    {
      name: 'Parent',
      value: 'Parent',
      children: [
        {
          name: 'Child',
          value: 'Child',
          children: [
            {
              name: 'Child',
              value: 'Child',
              children: []

              
            }
          ]
        }
      ]
    },
   

  ]

  tree_select_value = ""

  constructor(
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      firstname: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
      customSelect:  ['', [Validators.required]],
      customTreeSelect:  ['', [Validators.required]],



    })

  }

  ngOnInit(): void {
  }

  log(){
    console.log(this.tree_select_value)
  }
  onSubmit(form: any){
    console.log(form.value)
  }}
