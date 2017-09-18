import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const texts = [
      { id: 0,  value: ["First"], cValue: "Fi___", isHidden: false},
      { id: 1,  value: ["Second"], cValue: "Fi___", isHidden: false},
      { id: 2,  value: ["Third"], cValue: "Fi___", isHidden: false},
      { id: 3,  value: ["Fourth"], cValue: "Fi___", isHidden: false},
      { id: 4,  value: ["Fifth"], cValue: "Fi___", isHidden: false},
      { id: 5,  value: ["Sixth"], cValue: "Fi___", isHidden: false},
      { id: 6,  value: ["Seventh"], cValue: "Fi___", isHidden: false},
    ];
    return {texts};
  }

}
