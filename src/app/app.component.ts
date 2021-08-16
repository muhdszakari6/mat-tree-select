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
  firstResultMultiple = ''
  secondResult = ''
  secondResultMultiple = ''
  thirdResult = ''
  thirdResultMultiple = ''


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
  original_tree_options: TreeData[] = [
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
  tree_select_value_multiple: any;
  tree_select_value2_multiple: any;



  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      treedata: [JSON.stringify(this.tree_options), [Validators.required]],

      customSelect: ['', [Validators.required]],
      customTreeSelect: ['', [Validators.required]],
      customTreeSelectMultiple: ['', [Validators.required]],




    })

  }

  generate() {
    this.showTreeSelect = false;
    setTimeout(() => {
      this.showTreeSelect = true;
    }, 1000);
    this.tree_options = JSON.parse(this.form.value.treedata)

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.tree_options = [];
      console.log(this.tree_options)
    }, 3000);
  }

  filter(array: TreeData[], text: string) {

    const getNodes = (result:any, object:any) => {

   
      if ( object.name.toLowerCase().startsWith(text)) {
        console.log(text)

          result.push(object);
          return result;
      }
      if (Array.isArray(object.children)) {
        const children = object.children.reduce(getNodes, []);
        if (children.length) result.push({ ...object, children });
      }
      return result;
    };

    this.tree_options = array.reduce(getNodes, []);
  }



  log() {
    this.secondResult = JSON.stringify(this.tree_select_value)
    this.secondResultMultiple = JSON.stringify(this.tree_select_value_multiple)
  }
  third() {
    this.thirdResult = JSON.stringify(this.tree_select_value2)
    this.thirdResultMultiple = JSON.stringify(this.tree_select_value2_multiple)

  }
  onSubmit(form: any) {
    this.firstResult = JSON.stringify(form.value.customTreeSelect)
    this.firstResultMultiple = JSON.stringify(form.value.customTreeSelectMultiple)
  }
}

