# MatTreeSelectInput

An angular material select formfield that allows user to select option from a tree data structure.

## Dependencies
*  [Angular](https://angular.io/)
* [Angular material](https://material.angular.io/)


## Features
* Select single tree option
* Select multiple tree option 
* Unlimited tree level 
* Collapsable trees

## Demo
 [Demo Application](https://mat-tree-select-input-demo.netlify.app/)

## Installation
After installing the above dependencies. Install mat-tree-select-input via.
```bash 
npm i mat-tree-select-input
```

Once installed you need to import our main module in your application module:
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

    this.tree_options = array.reduce(getNodes, []);
  }

```