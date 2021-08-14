import { TestBed } from '@angular/core/testing';

import { MatTreeSelectInputService } from './mat-tree-select-input.service';

describe('MatTreeSelectInputService', () => {
  let service: MatTreeSelectInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatTreeSelectInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
