import { TestBed, inject } from '@angular/core/testing';

import { InMemDataService } from './in-mem-data.service';

describe('InMemDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemDataService]
    });
  });

  it('should ...', inject([InMemDataService], (service: InMemDataService) => {
    expect(service).toBeTruthy();
  }));
});
