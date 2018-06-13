import { Injectable } from '@angular/core';

@Injectable()
export class LanguageTranslateService {
  private userData = {};
  constructor() { }
  public getTextLanguage(langData) {
    this.userData = langData;
  }

}
