# MatTreeSelectInput

An angular material select formfield that allows user to select option from a tree like structure.
Similar to Angular mat-select, but the options are provided in a tree like structure.

## Dependencies
*  [Angular](https://angular.io/)
* [Angular material](https://material.angular.io/)


## Features
* Select single tree option
* Select multiple tree option 
* Unlimited tree level 
* Collapsable trees
* Built-in search/filter (`[searchable]="true"`)
* Standalone components, plus the original NgModule

## Compatibility
| mat-tree-select-input | Angular / Angular Material |
|---|---|
| 2.1.x | 19, 20, 21, 22 |
| 2.0.x | 19 |

## Demo
 [Demo Application](https://mat-tree-select-input-demo.netlify.app/)
 
  ## Note
You need to have @angular/material installed in your project, as it is a Peer Dependency.


 ## Example
![mat-tree-select-input example ](https://res.cloudinary.com/muhdsalim/image/upload/v1631314473/Screenshot_148_innlac.png)


## Installation
After installing the above dependencies. Install mat-tree-select-input via.
```bash 
npm i mat-tree-select-input
```

### Standalone components
Import the component you need straight into your standalone component:
```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeSelectInputComponent, MatTreeSelectInputNgmodelComponent } from 'mat-tree-select-input';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, MatTreeSelectInputComponent, MatTreeSelectInputNgmodelComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}
```

### NgModule
If your app uses NgModules, import the module in your application module:
```javascript 
import { MatTreeSelectInputModule } from 'mat-tree-select-input';
 

@NgModule({
  declarations: [AppComponent, ...],
  imports: [MatTreeSelectInputModule, ...],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```

## Usage
mat-tree-select-input with form control: Pass in formControlName to controlName input. 
```html 
        <form  [formGroup]="form">
            ....
            <ngx-mat-tree-select-input 
                    [options]="options"
                    [placeholder]="'Select Category'" 
                    [heading] = "'Children of'"
                    [controlName]="'category'">
            </ngx-mat-tree-select-input>
            ....
        </form>
```

mat-tree-select-input (multiple) with form control.
```html 
        <form  [formGroup]="form">
            ....
            <ngx-mat-tree-select-input 
                    [multiple]= "true"
                    [options]="options"
                    [heading] = "'Children of'"
                    [placeholder]="'Select Category'" 
                    [controlName]="'category'">
            </ngx-mat-tree-select-input>
            ....
        </form>
```

mat-tree-select-input with NgModel.
```html 
            ....
            <ngx-mat-tree-select-input-ngmodel 
                    (selectionChanged)="onSelectionChanged()"
                    [(select)]="value"
                    [options]="options"
                    [heading] = "'Sub Categories of'"
                    [placeholder]="'Select Category'" 
                    >
            </ngx-mat-tree-select-input-ngmodel>
            ....
```
mat-tree-select-input with NgModel(multiple).

```html 
            ....
            <ngx-mat-tree-select-input-ngmodel 
                    (selectionChanged)="onSelectionChanged()"
                    [(select)]="value"
                    [multiple]= "true"
                    [options]="options"
                    [heading] = "'Sub Categories of'"
                    [placeholder]="'Select Category'" 
                    >
            </ngx-mat-tree-select-input-ngmodel>
            ....
```

Creating options to pass into the component. 
In your component import TreeData from mat-tree-select-input via 
```javascript
import { TreeData } from 'mat-tree-select-input';
```
Declare options property to be of type TreeData[], sample:
```typescript
options: TreeData[] = []
```
TreeData is an interface exported from mat-tree-select-input, below is the definition of the interface
```typescript 
interface TreeData {
            name: string
            value: string
            children: TreeData[]
        }
```
Hence, a sample option will be 
```typescript 

 options: TreeData[] = [
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
  ```

Finnaly pass it to any one of the examples(code snippet) above

In cases where your data is not exactly the type of Treedata[], below is a sample method you can use to convert it to a TreeData[].
You can modify this method to best suit your use case.
```typescript

  constructTreeData(data){
    return data.map(
      (item)=>{
        let o = {
          name: item.name,
          value: item.id,
          children: item.Children.length ? this.constructTreeData(item.Children) : []
        }
        return o
      }
    )
  }

```
## Built-in search
Set `searchable` to show a search box at the top of the dropdown. It works with both components, single and multiple select:
```html
    <ngx-mat-tree-select-input
      [options]="options"
      [searchable]="true"
      [searchPlaceholder]="'Search categories'"
      [placeholder]="'Select Category'"
      [controlName]="'category'">
    </ngx-mat-tree-select-input>
```

| Input | Default | Description |
|---|---|---|
| `searchable` | `false` | Shows the search box. |
| `searchPlaceholder` | `'Search'` | Placeholder (and accessible label) of the search box. |
| `noResultsText` | `'No results found'` | Shown when nothing matches. |
| `filterPredicate` | case-insensitive "contains" on `name` | `(node: TreeData, term: string) => boolean` to customise matching. |

How it behaves:
* A matching node is shown with its parents (expanded automatically) and its children.
* Selected options stay selected while they are hidden by a search, so in multiple mode you can search, pick, search again and pick more.
* The search box is focused when the dropdown opens and cleared when it closes.

To match on something other than the name, pass your own predicate:
```typescript
import { TreeFilterPredicate } from 'mat-tree-select-input';

matchByValue: TreeFilterPredicate = (node, term) => node.value.toLowerCase().includes(term.toLowerCase());
```
```html
    <ngx-mat-tree-select-input [searchable]="true" [filterPredicate]="matchByValue" ...>
    </ngx-mat-tree-select-input>
```

## Custom filter (content projection)
If you need full control, you can still project your own input into the component instead of using `searchable`.
Note: this example replaces `options`, so in multiple mode selections that are filtered out are dropped. The built-in search does not have this problem.

To implement filter for our mat-tree-select-input you can project an input into the component for example
```html
    <ngx-mat-tree-select-input 
      [options]="options"
      [placeholder]="' Select Category'"
      [controlName]="'customTreeSelect'"
      >

      <input 
        #searchInput 
        placeholder="Search" 
        (keydown)="$event.stopPropagation()"
        (keyup)="filter(original_options,searchInput.value)"
      >

    </ngx-mat-tree-select-input>

```

And then, implement the filter method. for example:
```typescript
  filter(array: TreeData[], text: string) {

    const getNodes = (result, object) => {   
      if ( object.name.toLowerCase().startsWith(text)) {
          result.push(object);
          return result;
      }
      if (Array.isArray(object.children)) {
        const children = object.children.reduce(getNodes, []);
        if (children.length) result.push({ ...object, children });
      }
      return result;
    };

    this.options = array.reduce(getNodes, []);
  }

```

To disable the selection of parent nodes, add the property canSelectParentNode and set it to false. For example with ngModel. 
```html
  ...
   <ngx-mat-tree-select-input-ngmodel 
                    (selectionChanged)="onSelectionChanged()"
                    [(select)]="value"
                    [options]="options"
                    [heading] = "'Sub Categories of'"
                    [canSelectParentNode] = "false"
                    [placeholder]="'Select Category'" 
                    >
    </ngx-mat-tree-select-input-ngmodel>
  ...
```
or with Reactive Form. 
```html
            <ngx-mat-tree-select-input 
                    [options]="options"
                    [placeholder]="'Select Category'" 
                    [heading] = "'Children of'"
                    [canSelectParentNode] = "false"
                    [controlName]="'category'">
            </ngx-mat-tree-select-input>
```
