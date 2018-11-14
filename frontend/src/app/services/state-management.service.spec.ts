import { TestBed, inject } from '@angular/core/testing';

import { StateManagementService } from './state-management.service';

describe('StateManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateManagementService]
    });
  });

  it('should be created', inject([StateManagementService], (service: StateManagementService) => {
    expect(service).toBeTruthy();
  }));
});
