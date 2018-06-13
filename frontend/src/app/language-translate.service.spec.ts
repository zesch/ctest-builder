import { TestBed, inject } from '@angular/core/testing';

import { LanguageTranslateService } from './language-translate.service';

describe('LanguageTranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageTranslateService]
    });
  });

  it('should be created', inject([LanguageTranslateService], (service: LanguageTranslateService) => {
    expect(service).toBeTruthy();
  }));
});
