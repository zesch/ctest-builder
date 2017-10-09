import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const tokens = [
      { id: 0,  value: "First", altValue: ['firstAlt','aaaaaaa'], offset: 3, isGap: false, isSpecial: false},
      { id: 1,  value: "Second", altValue: [],offset: 4,  isGap: false, isSpecial: true},
      { id: 2,  value: "Third", altValue: ['thridAlt'], offset: 1, isGap: false, isSpecial: false},
      { id: 3,  value: "Fourth", altValue: ['fourthAlt'], offset: 4, isGap: false, isSpecial: false},
      { id: 4,  value: "Fifth", altValue: ['fifthAlt'], offset: 3, isGap: false, isSpecial: false},
      { id: 5,  value: "Sixth", altValue: ['sixthAlt'], offset: 2, isGap: false, isSpecial: false},
      { id: 6,  value: "Seventh", altValue: ['seventhAlt'], offset: 4, isGap: false, isSpecial: false},
    ];
    return {tokens};
  }
}
