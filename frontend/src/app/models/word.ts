import { v4 as uuid } from "uuid";

export interface Word {
    id: string;
    alternatives: string[];
    gapStatus: boolean;
    offset: number;
    value: string;
    isNormal: boolean;
}

const DEFAULT_WORD: Word = {
  id: "",
  alternatives: [],
  gapStatus: false,
  offset: 0,
  value: "",
  isNormal: true
}

export class Token implements Word {
  public id: string;
  public alternatives: string[];
  public gapStatus: boolean;
  public offset: number;
  public value: string;
  public isNormal: boolean;

  /**
   * Creates a new Token. If a Word is given, its values are copied to the new Token.
   * @param word The word providing the values for the token.
   */
  constructor(word: Word = DEFAULT_WORD) {
    this.set(word);
    this.id = uuid();
  }

  /**
   * Sets the values of this Token to the values of the given Word.
   * @param word The word providing the values for the token.
   */
  public set(word: Word) {
    this.id = word.id;
    this.alternatives = word.alternatives.concat();
    this.gapStatus = word.gapStatus;
    this.offset = word.offset;
    this.value = word.value;
    this.isNormal = word.isNormal;
  }

  /**
   * Returns the non-gapped part of the Token.
   */
  public getPrompt(): string {
    return this.value.substring(0, this.offset);
  }

  /**
   * Returns the primary solution for the Token.
   */
  public getSolution(): string {
    return this.value.substring(this.offset, this.value.length);
  }

  /**
   * Returns all valid solutions for the Token as an array.
   */
  public getAllSolutions(): string[] {
    return [this.getSolution(), ...this.alternatives]
  }
}
