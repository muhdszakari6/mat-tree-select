import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTreeSelectInputComponent } from './mat-tree-select-input.component';

describe('MatTreeSelectInputComponent', () => {
  let component: MatTreeSelectInputComponent;
  let fixture: ComponentFixture<MatTreeSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTreeSelectInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTreeSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
