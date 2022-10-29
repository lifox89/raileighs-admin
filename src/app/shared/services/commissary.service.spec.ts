import { TestBed } from '@angular/core/testing';

import { CommissaryService } from './commissary.service';

describe('CommissaryService', () => {
  let service: CommissaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
