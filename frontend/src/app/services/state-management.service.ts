import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Word, Token } from '../models/word';
import { createStore, Store, Reducer } from 'redux';

/**
 * Reducer handling incoming WordChangeEvents
 * @param state an array of Word objects.
 * @param action the WordChangeEvent to handle
 */
const words: Reducer = (state: Word[]=[], action: WordChangeEvent) => {
  const target: Word = action.word;
  switch(action.type) {
    case 'ADD_WORD':
      return state.concat(target);
    case 'DELETE_WORD':
      return state.filter(word => word.id !== target.id);
    case 'MODIFY_WORD':
      return state.map(word => word.id === target.id ? target : word);
    default:
      return state;
  }
}

export interface ChangeEvent { type: String }
export interface WordChangeEvent extends ChangeEvent { word: Word }

@Injectable()
export class StateManagementService {

  /**
   * Observable emitting the current state of words.
   */
  public words$: BehaviorSubject<Word[]>;

  /**
   * Redux Store that manages the application's state.
   */
  private store: Store = createStore(words);

  constructor() {
    this.words$ = new BehaviorSubject([]);
    this.store.subscribe(() => { this.words$.next(this.store.getState()) })
  }

  /**
   * Handles the given event and adds it to the history.
   */
  public dispatch(event: ChangeEvent) {
    //TODO: Implement.
  }

  /**
   * Undos the last action.
   */
  public undo() {
    //TODO: Implement
  }

  /**
   * Redoes the latest action that was reverted.
   */
  public redo() {
    //TODO: Implement
  }
}
