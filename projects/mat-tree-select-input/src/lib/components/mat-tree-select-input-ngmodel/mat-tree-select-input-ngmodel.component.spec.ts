import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTreeSelectInputNgmodelComponent } from './mat-tree-select-input-ngmodel.component';

describe('MatTreeSelectInputNgmodelComponent', () => {
  let component: MatTreeSelectInputNgmodelComponent;
  let fixture: ComponentFixture<MatTreeSelectInputNgmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTreeSelectInputNgmodelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTreeSelectInputNgmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
