import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Word, Token } from '../models/word';
import { createStore, Store, Reducer, combineReducers } from 'redux';
import undoable, { distinctState } from 'redux-undo';

export interface ChangeEvent { type: Action }
export interface WordChangeEvent extends ChangeEvent { word: Word }

export enum Action {
  Add = 'ADD_WORD',
  Delete = 'DELETE_WORD',
  Modify = 'MODIFY_WORD',
  Clear = 'CLEAR_WORDS',
  Undo = 'UNDO',
  Redo = 'REDO'
}

/**
 * Reducer handling incoming WordChangeEvents.
 *
 * @param state  an array of Word objects representing the current state
 * @param action  the WordChangeEvent to handle
 * @return  a new array of Words, representing the new state
 */
const handleWordChange: Reducer = (state: Word[]=[], action: WordChangeEvent) => {
  const target: Word = action.word;
  switch(action.type) {
    case Action.Add:
      return state.concat(target);
    case Action.Delete:
      return state.filter(word => word.id !== target.id);
    case Action.Modify:
      return state.map(word => word.id === target.id ? target : word);
    case Action.Clear:
      return [];
    default:
      return state.concat();
  }
}

@Injectable()
export class StateManagementService {

  /**
   * Observable emitting the current state of words.
   */
  public words$: BehaviorSubject<Word[]>;

  /**
   * Redux Store that manages the application's state.
   */
  private store: Store;

  constructor() {
    this.words$ = new BehaviorSubject([]);

    let stateModel: Reducer = combineReducers({
      words: handleWordChange
    });

    let undoConfig = {
      undoType: Action.Undo,
      redoType: Action.Redo,
      filter:  distinctState()
    }

    this.store = createStore(undoable(stateModel, undoConfig));
    this.store.subscribe(() => { this.words$.next(this.store.getState().present.words) });
  }

  /**
   * Handles the given event and adds it to the history.
   *
   * This is a rather low-level approach.
   * Use the Service's action-related methods instead.
   *
   * @see StateManagementService.add(word: Word)
   * @see StateManagementService.delete(word: Word)
   * @see StateManagementService.modify(word: Word)
   */
  public dispatch(event: ChangeEvent) {
    this.store.dispatch(event);
  }

  /**
   * Adds the given word to the current state model.
   */
  public add(word: Word) {
    const event: WordChangeEvent = { type: Action.Add, word: word };
    this.store.dispatch(event);
  }

  /**
   * Convenience Method for adding multiple words.
   * @param words
   */
  public addAll(words: Word[]) {
    for (let word of words) {
      this.add(word);
    }
  }

  /**
   * Convenience Method for setting the current state to the given array of words.
   * @param words
   */
  public set(words: Word[]) {
    this.clear();
    for (let word of words) {
      this.add(word);
    }
  }

  /**
   * Clears the current state of words.
   * Sets the current list of words to an empty array.
   */
  public clear() {
    this.store.dispatch({ type: Action.Clear, word: null});
  }

  /**
   * Deletes the given word from the current state model.
   */
  public delete(word: Word) {
    const event: WordChangeEvent = { type: Action.Delete, word: word };
    this.store.dispatch(event);
  }

  /**
   * Modifies the word in the current state model.
   * The word to modify is identified by its id.
   * If the current state model does not contain a word with a matching id,
   * nothing is changed.
   */
  public modify(word: Word) {
    const event: WordChangeEvent = { type: Action.Modify, word: word };
    this.store.dispatch(event);
  }

  /**
   * Undos the last action.
   */
  public undo() {
    this.store.dispatch({ type: Action.Undo })
  }

  /**
   * Redoes the latest action that was reverted.
   */
  public redo() {
    this.store.dispatch({ type: Action.Redo })
  }
}
