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
  showTreeSelect: boolean = true
  firstResult = ''
  secondResult = ''
  thirdResult = ''


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
      name: 'Electronics',
      value: 'Electronics',
      children: [
        {
          name: 'Phones',
          value: 'Phones',
          children: [
            {
              name: 'Iphones',
              value: 'Iphones', 
              children: []
              
            } 
          ]
        }
      ]
    },
   
    {
      name: 'Web Development',
      value: 'Web Development',
      children: [
        {
          name: 'Frontend Development',
          value: 'Frontend Development',
          children: [
            {
              name: 'Angular',
              value: 'Angular',
              children: []

              
            },
            {
              name: 'React',
              value: 'React',
              children: []

              
            }
          ]
        }
      ]
    },
   

  ]

  tree_select_value = ""
  tree_select_value2 = ""


  constructor(
    private fb: FormBuilder
  ) { 
    this.form = this.fb.group({
      treedata: [JSON.stringify(this.tree_options), [Validators.required]],

      customSelect:  ['', [Validators.required]],
      customTreeSelect:  ['', [Validators.required]],



    })

  }

  generate(){
    this.showTreeSelect = false;
    setTimeout(() => {
      this.showTreeSelect = true;
    }, 1000);
    this.tree_options = JSON.parse(this.form.value.treedata)
    
  }

  ngOnInit(): void {
  }

  log(){
    this.secondResult = JSON.stringify(this.tree_select_value)
  }
  third(){
    this.thirdResult = JSON.stringify(this.tree_select_value2)

  }
  onSubmit(form: any){
    this.firstResult = JSON.stringify(form.value.customTreeSelect)
  }}

