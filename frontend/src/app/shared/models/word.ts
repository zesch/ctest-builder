export interface Word {
    id: number;
    showAlternatives: boolean;
    alternatives: string[];
    boldStatus: boolean;
    gapStatus: boolean;
    offset: number;
    value: string;
}

export class Token implements Word {
  public id: number = -1;
  public showAlternatives: boolean = false;
  public alternatives: string[] = [];
  public boldStatus: boolean = false;
  public gapStatus: boolean = false;
  public offset: number = 0;
  public value: string = "";
  public locked?: boolean = false;

  public set(word: Word) {
    this.id = word.id;
    this.showAlternatives = word.showAlternatives;
    this.alternatives = word.alternatives.concat();
    this.boldStatus = word.boldStatus;
    this.gapStatus = word.gapStatus;
    this.offset = word.offset;
    this.value = word.value;
  }
}
