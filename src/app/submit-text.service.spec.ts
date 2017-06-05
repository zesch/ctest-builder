import { TestBed, inject } from '@angular/core/testing';

import { SubmitTextService } from './submit-text.service';

describe('SubmitTextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubmitTextService]
    });
  });

  it('should ...', inject([SubmitTextService], (service: SubmitTextService) => {
    expect(service).toBeTruthy();
  }));
});
