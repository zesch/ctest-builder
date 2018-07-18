import { TestBed, inject } from '@angular/core/testing';

import { CtestService } from './ctest.service';

describe('CtestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CtestService]
    });
  });

  it('should be created', inject([CtestService], (service: CtestService) => {
    expect(service).toBeTruthy();
  }));
});
