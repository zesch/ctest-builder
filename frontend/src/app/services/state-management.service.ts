import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Word, Token } from '../models/word';
import { createStore, Store, Reducer, combineReducers } from 'redux';
import distinctState from 'redux-undo';
import undoable from 'redux-undo';

export interface ChangeEvent { type: Action }
export interface WordChangeEvent extends ChangeEvent { words: Word[], index: number }

export enum Action {
  Add = 'ADD_WORD',
  AddAll = 'ADD_WORDS',
  Delete = 'DELETE_WORD',
  Modify = 'MODIFY_WORD',
  Move = 'MOVE_WORD',
  Clear = 'CLEAR_WORDS',
  Set = 'SET_WORDS',
  Undo = 'UNDO',
  Redo = 'REDO'
}

/**
 * Reducer handling incoming WordChangeEvents.
 *
 * @param state  an array of Word objects representing the current state
 * @param action  the WordChangeEvent to handle
 * @return  a new array of Words, representing the new state
 *
 * @see Reducer
 */
const handleWordChange: Reducer<Word[], WordChangeEvent> = (state: Word[]=[], action: WordChangeEvent) => {
  const targets: Word[] = action.words;
  const target: Word = targets ? Token.clone(targets[0]) : new Token; // cloning due to redux immutability requirements
  const index: number = action.index;

  switch(action.type) {
    case Action.Add:
      return state.concat(target);
    case Action.AddAll:
      return state.concat(targets);
    case Action.Clear:
      return [];
    case Action.Delete:
      return state.filter(word => word.id !== target.id);
    case Action.Modify:
      return state.map(word => word.id === target.id ? target : word);
    case Action.Move:
      const newState = state.concat();
      const oldIndex = newState.findIndex(word => word.id === target.id);
      newState.splice(oldIndex, 1); // remove target from old position
      newState.splice(index, 0, target); // insert target at new position
      return newState;
    case Action.Set:
      return targets.concat();
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
   * Indicates whether an undo action can be applied.
   */
  public hasUndo: boolean;

  /**
   * Indicates whether a redo action can be applied.
   */
  public hasRedo: boolean;

  /**
   * Redux Store that manages the application's state.
   */
  private store: Store;

  constructor() {
    this.words$ = new BehaviorSubject<Word[]>([]);
    this.hasUndo = false;
    this.hasRedo = false;

    let stateModel: Reducer<any, WordChangeEvent> = combineReducers({
      words: handleWordChange
    });

    let undoConfig = {
      undoType: Action.Undo,
      redoType: Action.Redo,
    }

    this.store = createStore(undoable(stateModel, undoConfig));
    this.store.subscribe(() => {
      const state = this.store.getState();
      this.hasUndo = state.past.length !== 0;
      this.hasRedo = state.future.length !== 0;
      this.words$.next(state.present.words)
    });
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
    const event: WordChangeEvent = { type: Action.Add, words: [word], index: 0 };
    this.store.dispatch(event);
  }

  /**
   * Adds the given words to the current state.
   */
  public addAll(words: Word[]) {
    const action: WordChangeEvent = { type: Action.AddAll, words: words, index: 0};
    this.store.dispatch(action);
  }

  /**
   * Sets the current state to the given words.
   */
  public set(words: Word[]) {
    const action: WordChangeEvent = { type: Action.Set, words: words, index: 0  };
    this.store.dispatch(action);
  }

  /**
   * Clears the current state of words.
   * Sets the current list of words to an empty array.
   */
  public clear() {
    this.store.dispatch({ type: Action.Clear, word: null});
  }

  /**
   * Clears the store's history, past and future.
   */
  public clearHistory() {
    const state = this.store.getState();
    state.history = [];
    state.past = [];
    state.future = [];
  }

  /**
   * Deletes the given word from the current state model.
   */
  public delete(word: Word) {
    const event: WordChangeEvent = { type: Action.Delete, words: [word], index: 0 };
    this.store.dispatch(event);
  }

  /**
   * Modifies the word in the current state model.
   * The word to modify is identified by its id.
   * If the current state model does not contain a word with a matching id,
   * nothing is changed.
   */
  public modify(word: Word) {
    const event: WordChangeEvent = { type: Action.Modify, words: [word], index: 0 };
    this.store.dispatch(event);
  }

  /**
   * Moves the given word to the given index.
   */
  public move(word: Word, index: number) {
    const event: WordChangeEvent = { type: Action.Move, words: [word], index: index };
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